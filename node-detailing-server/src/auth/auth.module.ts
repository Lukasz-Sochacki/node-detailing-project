import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    UsersModule, // Daje dostęp do bazy danych użytkowników przez UsersService
    PassportModule, // Odpowiada za obsługę Guardów i Strategii
    JwtModule.register({
      // Rejestrujemy moduł generowania tokenów
      secret: process.env.JWT_SECRET || 'fallback_secret_key',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any,
      },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
