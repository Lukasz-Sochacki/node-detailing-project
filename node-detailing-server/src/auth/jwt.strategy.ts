/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      // Definiujemy ekstraktor, który wyciągnie nasz token z ciasteczka 'auth'
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies['auth'];
          if (!data) {
            return null;
          }
          return data.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret_key', // Klucz weryfikacyjny z pliku .env
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.getById(payload.sub);
    return user;
  }
}
