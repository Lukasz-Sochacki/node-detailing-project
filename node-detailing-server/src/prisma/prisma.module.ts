import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

Global(); // Dzięki temu dekoratorowi nie będziesz musiał importować PrismaModule w każdym module z osobna
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Eksportujemy, aby inne serwisy miały dostęp do bazy
})
export class PrismaModule {}
