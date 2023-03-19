import { IsString } from 'class-validator';

export class CreatePostBlogDto {
  @IsString()
  title: string;
  @IsString()
  shortDescription: string;
  @IsString()
  content: string;
}
