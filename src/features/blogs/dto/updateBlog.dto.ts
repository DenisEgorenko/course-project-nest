import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './createBlog.dto';
import { IsString, IsUrl, Length } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdateBlogDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 15)
  name: string;
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 500)
  description: string;
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsUrl()
  @Length(1, 100)
  websiteUrl: string;
}
