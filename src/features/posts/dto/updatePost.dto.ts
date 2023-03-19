import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './createPost.dto';
import { IsString, Length } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @Length(0, 30)
  title: string;
  @IsString()
  @Length(0, 100)
  shortDescription: string;
  @IsString()
  @Length(0, 1000)
  content: string;
  @IsString()
  blogId: string;
}
