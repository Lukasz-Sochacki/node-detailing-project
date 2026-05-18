import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    PrismaModule, // Rejestrujemy globalny moduł bazy danych
    ProjectsModule, // Rejestrujemy moduł projektów
    ContactModule, // Rejestrujemy moduł formularza kontaktowego
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
