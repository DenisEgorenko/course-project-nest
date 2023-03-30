import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';

export class BanUserBlogStatusDto {
  @IsBoolean()
  isBanned: boolean;
  @IsString()
  @Length(20)
  banReason: string;
  @IsString()
  blogId: string;
}
