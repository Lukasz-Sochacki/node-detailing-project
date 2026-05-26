/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client'; // Usunięto User

@Injectable()
export class ProjectsService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<Project[]> {
    return this.prismaService.project.findMany({
      orderBy: {
        orderIndex: 'asc', // asc sprawii, że 0 wyświetli się nad 1, 1 nad 2 itd.
      },
    });
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
  // Metoda pomocnicza do pobierania pojedynczego projektu
  public async getProjectById(id: string): Promise<Project | null> {
    return this.prismaService.project.findUnique({
      where: { id },
    });
  }
  // LOGIKA ZAMIANY MIEJSC W BAZIE MYSQL
  public async swapOrder(id: string, direction: 'UP' | 'DOWN'): Promise<void> {
    const currentProject = await this.prismaService.project.findUnique({
      where: { id },
    });
    if (!currentProject) return;

    // Szukamy sąsiada (w zależności od kierunku strzałki)
    const neighbor = await this.prismaService.project.findFirst({
      where: {
        orderIndex:
          direction === 'UP'
            ? { lt: currentProject.orderIndex } // Mniejszy indeks (wyżej na liście)
            : { gt: currentProject.orderIndex }, // Większy indeks (niżej na liście)
      },
      orderBy: {
        orderIndex: direction === 'UP' ? 'desc' : 'asc', // wybieramy najbliższego sąsiada
      },
    });
    // Jeśli nie ma sąsiada (np. jesteśmy na samej górze lub samym dole), nic nie robimy
    if (!neighbor) return;

    // Zamieniamy indeksy miejscami w bezpiecznej transakcji bazodanowej Prismy
    await this.prismaService.$transaction([
      this.prismaService.project.update({
        where: { id: currentProject.id },
        data: { orderIndex: neighbor.orderIndex },
      }),
      this.prismaService.project.update({
        where: { id: neighbor.id },
        data: { orderIndex: currentProject.orderIndex },
      }),
    ]);
  }
}
