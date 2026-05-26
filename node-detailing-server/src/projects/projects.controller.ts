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
  NotFoundException, // DODAJEMY TE KLASY
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

  // ZABEZPIECZONY ENDPOINT POST: Odbiera tekst i fizyczny plik z dysku
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // Zapisujemy plik bezpośrednio do folderu public w Twoim React-Client
        destination: '../node-detailing-client/public/images/portfolio',
        filename: (req, file, cb) => {
          // Generujemy unikalną nazwę opartą o czas, zachowując oryginalne rozszerzenie (.jpg/.png)
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  public async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // 1024 * 1024 = 1048576 bajtów (dokładnie 1 Megabajt)
          new MaxFileSizeValidator({
            maxSize: 1048576,
            message: 'File is too heavy! Maximum allowed size is 1MB.',
          }),
          // Akceptujemy wyłącznie pliki graficzne: jpeg, jpg, png oraz nowoczesny, lekki webp
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    file: any,
    @Body() body: { title: string; category: any },
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required!');
    }
    // Ścieżka, która trafi na stałe do bazy danych MySQL przez Prismę
    const mainImage = `/images/portfolio/${file.filename}`;

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

  // TYLKO ZALOGOWANY ADMINISTRATOR MOŻE USUNĄĆ PROJEKT Z MYSQL
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    await this.projectsService.delete(id);
    return { message: 'success' };
  }
}
