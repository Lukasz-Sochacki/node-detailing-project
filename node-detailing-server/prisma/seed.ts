/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import { PrismaClient, Category } from '@prisma/client';
const db = new PrismaClient();

function getProjects() {
  return [
    {
      id: 'proj-ind-1',
      title: 'Structural Steel Warehouse Brisbane',
      category: Category.INDUSTRIAL,
      mainImage: '/images/portfolio/industrial-1.jpg',
    },
    {
      id: 'proj-ind-2',
      title: 'Automated Logistics Center Sydney',
      category: Category.INDUSTRIAL,
      mainImage: '/images/portfolio/industrial-2.jpg',
    },
    {
      id: 'proj-res-1',
      title: 'Luxury Residential Complex Melbourne',
      category: Category.RESIDENTIAL,
      mainImage: '/images/portfolio/residential-1.jpg',
    },
    {
      id: 'proj-res-2',
      title: 'Modern High-Rise Apartments Gold Coast',
      category: Category.RESIDENTIAL,
      mainImage: '/images/portfolio/residential-2.jpg',
    },
    {
      id: 'proj-com-1',
      title: 'A-Grade Commercial Tower Sydney CBD',
      category: Category.COMMERCIAL,
      mainImage: '/images/portfolio/commercial-1.jpg',
    },
    {
      id: 'proj-com-2',
      title: 'Tech Hub Office Building Adelaide',
      category: Category.COMMERCIAL,
      mainImage: '/images/portfolio/commercial-2.jpg',
    },
    {
      id: 'proj-edu-1',
      title: 'University Engineering Faculty Campus',
      category: Category.EDUCATION,
      mainImage: '/images/portfolio/education-1.jpg',
    },
  ];
}

async function seed() {
  await db.contactMessage.deleteMany();
  await db.project.deleteMany();

  await Promise.all(
    getProjects().map((project) => {
      return db.project.create({ data: project });
    }),
  );

  console.log('Seed zakończony pomyślnie z lokalnymi ścieżkami do zdjęć');
}

seed();
