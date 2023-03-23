import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(3, 10)
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @IsEmail()
  email: string;
}
