import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';

export class BanStatusDto {
  @IsBoolean()
  isBanned: boolean;
  @IsString()
  @Length(20)
  banReason: string;
}
