/* eslint-disable */
import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  NotFoundException,
  Patch, // DODAJEMY TE KLASY
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from '@prisma/client';
import { ParseUUIDPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get('/')
  public getAll(): Promise<Project[]> {
    return this.projectsService.getAll();
  }

  // ZABEZPIECZONY ENDPOINT POST: Zaktualizowany i odporny na błąd bufora pliku
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: '../node-detailing-client/public/images/portfolio',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      // NOWY FILTR: Sprawdzamy rozszerzenie pliku tekstowo - to działa zawsze i bez błędów pamięci!
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
          return cb(
            new BadRequestException(
              'Only image files are allowed! (.jpg, .jpeg, .png, .webp)',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  public async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Zostawiamy wyłącznie walidację wagi (ona nie potrzebuje bufora i działa idealnie!)
          new MaxFileSizeValidator({
            maxSize: 1048576,
            message: 'File is too heavy! Maximum allowed size is 1MB.',
          }),
        ],
      }),
    )
    image: any,
    @Body() body: { title: string; category: any },
  ) {
    if (!image) {
      throw new BadRequestException('Image file is required!');
    }

    const mainImage = `/images/portfolio/${image.filename}`;

    const newProject = await this.projectsService.create({
      title: body.title,
      category: body.category,
      mainImage: mainImage,
    });
    return newProject;
  }

  @Get('/:id')
  public async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Project> {
    const project = await this.projectsService.getById(id);
    if (!project) throw new NotFoundException('Project not found...');
    return project;
  }

  // ENDPOINT PRZESUWANIA W GÓRĘ
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Patch('/:id/move-up')
  public async moveUp(@Param('id') id: string) {
    await this.projectsService.swapOrder(id, 'UP');
    return { message: 'success' };
  }

  // ENDPOINT PRZESUWANIA W DÓŁ
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Patch('/:id/move-down')
  public async moveDown(@Param('id') id: string) {
    await this.projectsService.swapOrder(id, 'DOWN');
    return { message: 'success' };
  }

  // TYLKO ZALOGOWANY ADMINISTRATOR MOŻE USUNĄĆ PROJEKT Z MYSQL
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    await this.projectsService.delete(id);
    return { message: 'success' };
  }
}
