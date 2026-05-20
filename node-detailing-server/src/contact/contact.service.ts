/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContactMessage } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ContactService {
  private mautTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // DODAJEMY TĘ SEKCJĘ PONIŻEJ (Rozwiązuje problem błędu certyfikatu TLS):
    tls: {
      rejectUnauthorized: false,
    },
  });
  constructor(private prismaService: PrismaService) {}

  // Metoda do zapisu wiadomości w bazie danych
  public async create(
    data: Omit<ContactMessage, 'id' | 'createdAt'>,
  ): Promise<ContactMessage> {
    // 1. Zapisujemy kopię wiadomości w bazie danych MySQL
    const savedMessage = await this.prismaService.contactMessage.create({
      data,
    });
    // 2. Wysyłamy fizycznego maila na adres siostry
    const mailOptions = {
      from: `"${data.name}" <${data.email}>`, //Nadawca (klient strony)
      to: 'kate@nodedetailing.com.au', //Odbiorca docelowy (właściciel firmy)
      subject: `New Quote Request from ${data.name}`,
      text: data.message,
      html: `
        <h3>New Message from nodedetailing.com.au</h3>
        <p><strong>Client Name:</strong> ${data.name}</p>
        <p><strong><Client Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        `,
    };
    try {
      await this.mautTransporter.sendMail(mailOptions);
      console.log('Mail wysłany do Kate pomyślnie!');
    } catch (error) {
      // Jeśli mail nie dojdzie, błąd wyświetli się w terminalu serwera
      console.error('BŁĄD SMTP: ', error);
    }
    return savedMessage;
  }
}
