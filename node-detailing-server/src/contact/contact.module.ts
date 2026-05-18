import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // Importujemy moduł bazy danych

@Module({
  imports: [PrismaModule], // Wstrzykujemy PrismaModule do tablicy importów
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
