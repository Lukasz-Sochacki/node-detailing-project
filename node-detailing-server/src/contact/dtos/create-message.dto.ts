/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateMessageDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name!: string; // Używamy !: string

  @IsNotEmpty()
  @IsEmail()
  email!: string; // Używamy !: string

  @IsNotEmpty()
  @IsString()
  @Length(10, 1000)
  message!: string; // Używamy !: string
}
