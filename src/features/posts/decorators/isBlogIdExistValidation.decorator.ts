import {
  registerDecorator,
  validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsService } from '../../blogs/blogs.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsBlogIdExistConstraint implements ValidatorConstraintInterface {
  constructor(protected blogsService: BlogsService) {}
  async validate(blogId: string, args: ValidationArguments) {
    const blog = await this.blogsService.getBlogById(blogId);
    if (!blog) {
      return false;
    }
    return true;
  }
}

export function IsBlogIdExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBlogIdExistConstraint,
    });
  };
}
