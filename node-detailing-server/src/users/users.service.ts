import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public getByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { password: true },
    });
  }

  public getById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  // TA METODA MUSI BYĆ TUTAJ:
  public async create(
    userData: { email: string },
    hashedPassword: string,
  ): Promise<User> {
    const usersCount = await this.prismaService.user.count();
    const role = usersCount === 0 ? 'ADMIN' : 'USER';

    return this.prismaService.user.create({
      data: {
        email: userData.email,
        role: role,
        password: {
          create: {
            hashedPassword,
          },
        },
      },
    });
  }
}
