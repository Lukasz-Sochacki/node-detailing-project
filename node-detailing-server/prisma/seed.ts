/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import { PrismaClient, Category } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const db = new PrismaClient();

function getProjects() {
  return [
    {
      id: 'proj-ind-1',
      title: 'Structural Steel Warehouse Brisbane',
      category: Category.INDUSTRIAL,
      mainImage: '/images/portfolio/industrial-1.jpg',
      orderIndex: 0,
    },
    {
      id: 'proj-ind-2',
      title: 'Automated Logistics Center Sydney',
      category: Category.INDUSTRIAL,
      mainImage: '/images/portfolio/industrial-2.jpg',
      orderIndex: 1,
    },
    {
      id: 'proj-res-1',
      title: 'Luxury Residential Complex Melbourne',
      category: Category.RESIDENTIAL,
      mainImage: '/images/portfolio/residential-1.jpg',
      orderIndex: 2,
    },
    {
      id: 'proj-res-2',
      title: 'Modern High-Rise Apartments Gold Coast',
      category: Category.RESIDENTIAL,
      mainImage: '/images/portfolio/residential-2.jpg',
      orderIndex: 3,
    },
    {
      id: 'proj-com-1',
      title: 'A-Grade Commercial Tower Sydney CBD',
      category: Category.COMMERCIAL,
      mainImage: '/images/portfolio/commercial-1.jpg',
      orderIndex: 4,
    },
    {
      id: 'proj-com-2',
      title: 'Tech Hub Office Building Adelaide',
      category: Category.COMMERCIAL,
      mainImage: '/images/portfolio/commercial-2.jpg',
      orderIndex: 5,
    },
    {
      id: 'proj-edu-1',
      title: 'University Engineering Faculty Campus',
      category: Category.EDUCATION,
      mainImage: '/images/portfolio/education-1.jpg',
      orderIndex: 6,
    },
  ];
}

async function seed() {
  // Czyszczenie starych danych przed nowym załadowaniem bazy
  await db.password.deleteMany(); // Najpierw czyścimy powiązane hasła, by nie zepsuć relacji w bazie
  await db.user.deleteMany(); // Potem czyścimy użytkowników
  await db.contactMessage.deleteMany();
  await db.project.deleteMany();

  // 1. GENERUJEMY SZYFROWANE HASŁO DLA SIOSTRY (np. testowe: admin123)
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // 2. WSTRZYKUJEMY KONTO ADMINISTRATORA DLA SIOSTRY KATE
  const adminUser = await db.user.upsert({
    where: { email: 'kate@nodedetailing.com.au' },
    update: {},
    create: {
      email: 'kate@nodedetailing.com.au',
      role: 'ADMIN', // przypisujemy rolę ADMIN, na którę czeka nasz AdminAuthGuard
      password: {
        create: {
          hashedPassword: hashedPassword,
        },
      },
    },
  });
  console.log(`Konto administratora utworzone pomyślnie: ${adminUser.email} `);

  // 3. WSTRZYKUJEMY TWOJE PROJEKTY PORTFOLIO

  await Promise.all(
    getProjects().map((project) => {
      return db.project.create({ data: project });
    }),
  );

  console.log(
    'Seed zakończony pomyślnie z lokalnymi ścieżkami do zdjęć oraz kontem administratora!',
  );
}

seed();
