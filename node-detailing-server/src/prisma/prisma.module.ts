import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Eksportujemy, aby inne serwisy miały dostęp do bazy
})
export class PrismaModule {}
