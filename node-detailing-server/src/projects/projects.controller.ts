/* eslint-disable */
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from '@prisma/client';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get('/')
  public getAll(): Promise<Project[]> {
    return this.projectsService.getAll();
  }

  @Get('/:id')
  public async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Project> {
    const project = await this.projectsService.getById(id);
    if (!project) throw new NotFoundException('Project not found...');
    return project;
  }
}
