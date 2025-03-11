import { IsEmail, MinLength } from '@nestjs/class-validator';

export class Update_userDto {
  lastName?: string;

  firstName?: string;

  @IsEmail()
  email?: string;

  @MinLength(8)
  password?: string;
}
