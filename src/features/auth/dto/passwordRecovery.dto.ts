import { IsEmail, IsString } from 'class-validator';

export class PasswordRecoveryDto {
  @IsString()
  @IsEmail()
  email: string;
}
