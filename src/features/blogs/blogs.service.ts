import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { Blog, BlogDocument, BlogStatics } from './schema/blogs.schema';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    protected blogModel: Model<BlogDocument> & BlogStatics,
  ) {}

  async createBlog(createBlogDto: CreateBlogDto) {
    const newBlog = await this.blogModel.createBlog(
      createBlogDto.name,
      createBlogDto.description,
      createBlogDto.websiteUrl,
      this.blogModel,
    );

    await newBlog.save();

    return {
      id: newBlog.id,
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: false,
    };
  }

  async getBlogById(id: string) {
    const blog: BlogDocument[] = await this.blogModel.find({ id });
    if (blog.length) {
      return {
        id: blog[0].id,
        name: blog[0].name,
        description: blog[0].description,
        websiteUrl: blog[0].websiteUrl,
        createdAt: blog[0].createdAt,
      };
    } else {
      throw new NotFoundException('no such blog');
    }
  }

  async updateBlog(id: string, updateBlogDto: UpdateBlogDto) {
    const blogs: BlogDocument[] = await this.blogModel.find({ id });
    if (blogs.length) {
      const blog = blogs[0];

      blog.name = updateBlogDto.name;
      blog.description = updateBlogDto.description;
      blog.websiteUrl = updateBlogDto.websiteUrl;

      await blog.save();
    } else {
      throw new NotFoundException('no such blog');
    }
  }

  async deleteBlog(id: string) {
    const blogs: BlogDocument[] = await this.blogModel.find({ id });

    if (!blogs.length) {
      throw new NotFoundException('no such blog');
    }
    const deletedBlog = await this.blogModel.deleteOne({ id });

    return deletedBlog;
  }
}
