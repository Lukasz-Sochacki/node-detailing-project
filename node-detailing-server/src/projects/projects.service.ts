/* eslint-disable */
import { Injectable } from '@nestjs/common';
// Zmieniamy ścieżkę na relatywną (wygasza błędy typowania any w edytorze)
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<Project[]> {
    return this.prismaService.project.findMany();
  }

  public getById(id: Project['id']): Promise<Project | null> {
    return this.prismaService.project.findUnique({
      where: { id },
    });
  }
}
