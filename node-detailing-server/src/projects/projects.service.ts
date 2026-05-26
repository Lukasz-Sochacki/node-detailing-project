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

  public async delete(id: Project['id']): Promise<Project> {
    return this.prismaService.project.delete({
      where: { id },
    });
  }

  public async create(data: {
    title: string;
    category: any;
    mainImage: string;
  }): Promise<Project> {
    return this.prismaService.project.create({
      data: {
        title: data.title,
        category: data.category,
        mainImage: data.mainImage,
      },
    });
  }
}
