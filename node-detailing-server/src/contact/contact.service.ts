/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContactMessage } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private prismaService: PrismaService) {}

  // Metoda do zapisu wiadomości w bazie danych
  public create(
    data: Omit<ContactMessage, 'id' | 'createdAt'>,
  ): Promise<ContactMessage> {
    return this.prismaService.contactMessage.create({
      data,
    });
  }
}
