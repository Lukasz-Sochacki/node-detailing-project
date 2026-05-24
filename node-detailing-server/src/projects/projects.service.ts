/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client'; // Usunięto User

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
