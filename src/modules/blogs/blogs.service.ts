import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModel } from '../../db/schemas/blogs.schema';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    protected blogModel: BlogModel,
  ) {}

  async getBlogById(id: string): Promise<BlogDocument> {
    return this.blogModel.findOne({ id });
  }
}
