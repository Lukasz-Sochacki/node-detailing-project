import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // Importujemy moduł Prismy

@Module({
  imports: [PrismaModule], // Dodajemy do tablicy imports
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
