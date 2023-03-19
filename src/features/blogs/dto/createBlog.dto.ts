import { IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  @IsUrl()
  websiteUrl: string;
}
