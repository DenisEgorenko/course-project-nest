import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './createPost.dto';
import { IsString, Length } from 'class-validator';
import { IsBlogIdExist } from '../decorators/isBlogIdExistValidation.decorator';
import { Transform, TransformFnParams } from 'class-transformer';

export class UpdatePostDto {
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 30)
  title: string;
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 100)
  shortDescription: string;
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(1, 1000)
  content: string;
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsBlogIdExist({ message: 'Blog does not exist' })
  blogId: string;
}
