import { IsEmail, IsString } from 'class-validator';

export class ResendConfirmationDto {
  @IsString()
  @IsEmail()
  email: string;
}
