/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDTO } from './dtos/register.dto';
import { User } from '@prisma/client';
// Kluczowa poprawka: Poprawny, czysty import typu dla JwtService
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async register(registrationData: RegisterDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const userData = {
      email: registrationData.email,
    };
    return this.usersService.create(
      userData,
      hashedPassword,
    ) as unknown as Promise<User>;
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.getByEmail(email);
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password.hashedPassword))
    ) {
      const { password: userPassword, ...result } = user;
      return result;
    }
    return null;
  }

  public createSession(user: User): { access_token: string } {
    const payload = { email: user.email, sub: user.id };
    // Przekazujemy sekret jawnie do podpisu, co eliminuje błąd 500 JwtModule
    const accessToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_SECRET ||
        'NodeDetailingSuperSecretKey2026!#Engineering',
    });
    return {
      access_token: accessToken,
    };
  }
}
