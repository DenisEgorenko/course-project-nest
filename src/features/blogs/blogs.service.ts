import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBlogDto } from './dto/createBlog.dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { Blog, BlogDocument, BlogModel } from './schema/blogs.schema';
import { blogToOutputModel } from './models/blogsToViewModel';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    protected blogModel: BlogModel,
  ) {}

  async createBlog(createBlogDto: CreateBlogDto): Promise<BlogDocument> {
    const newBlog = await this.blogModel.createBlog(
      createBlogDto.name,
      createBlogDto.description,
      createBlogDto.websiteUrl,
      this.blogModel,
    );

    return await newBlog.save();
  }

  async getBlogById(id: string): Promise<BlogDocument> {
    return this.blogModel.findOne({ id });
  }

  async updateBlog(id: string, updateBlogDto: UpdateBlogDto) {
    const blogs: BlogDocument[] = await this.blogModel.find({ id });
    if (blogs.length) {
      const blog = blogs[0];

      blog.setName(updateBlogDto.name);
      blog.setDescription(updateBlogDto.description);
      blog.setWebsiteUrl(updateBlogDto.websiteUrl);

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
