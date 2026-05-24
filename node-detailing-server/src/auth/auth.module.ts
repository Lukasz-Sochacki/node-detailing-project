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
    UsersModule,
    PassportModule,
    JwtModule.register({
      // Bezpieczny fallback, gdyby plik .env nie załadował się w milisekundzie startu
      secret:
        process.env.JWT_SECRET ||
        'NodeDetailingSuperSecretKey2026!#Engineering',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
