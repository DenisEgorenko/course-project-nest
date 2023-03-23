import { IsEmail, IsString, Length } from 'class-validator';

export class SetNewPasswordDto {
  @IsString()
  @Length(6, 20)
  newPassword: string;
  @IsString()
  recoveryCode: string;
}
