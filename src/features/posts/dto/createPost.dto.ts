import { IsString, Length } from 'class-validator';
import { IsBlogIdExist } from '../decorators/isBlogIdExistValidation.decorator';

export class CreatePostDto {
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
  @IsBlogIdExist({ message: 'Blog does not exist' })
  blogId: string;
}
