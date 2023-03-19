import { IsString, IsUrl, Length } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @Length(0, 15)
  name: string;
  @IsString()
  @Length(0, 500)
  description: string;
  @IsString()
  @IsUrl()
  @Length(0, 100)
  websiteUrl: string;
}
