/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Response,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { Response as ExpressResponse } from 'express';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  public register(@Body() registrationData: RegisterDTO) {
    return this.authService.register(registrationData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  public login(@Request() req: any, @Response() res: ExpressResponse) {
    // JAWNE RZUTOWANIE TYPU (as User): Informujemy lintera, że req.user to obiekt użytkownika z bazy
    const tokens = this.authService.createSession(req.user as User);

    res.cookie('auth', tokens, {
      httpOnly: true,
      secure: false,
    });

    return res.send({
      message: 'success',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/logout')
  public logout(@Response() res: ExpressResponse) {
    res.clearCookie('auth', { httpOnly: true });
    return res.send({
      message: 'success',
    });
  }
}
