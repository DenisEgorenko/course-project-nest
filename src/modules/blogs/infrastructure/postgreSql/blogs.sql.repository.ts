import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IBlogsRepository } from '../../core/abstracts/blogs.repository.abstract';
import { BlogBaseEntity } from '../../core/entity/blog.entity';
import { Blog } from './model/blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsSqlRepository implements IBlogsRepository {
  constructor(
    @InjectRepository(Blog)
    protected blogsRepository: Repository<Blog>,
  ) {}

  async save(blog: BlogBaseEntity) {
    return this.blogsRepository.save(blog);
  }
  async getBlogById(id: string): Promise<Blog> {
    return this.blogsRepository.findOne({
      relations: {
        user: true,
        // blogsBanInfo: true,
      },
      where: {
        id,
      },
      select: {
        user: { id: true, login: true, email: true },
      },
    });
  }

  async getAllBannedBlogsIds() {
    const blogs = await this.blogsRepository.find({
      where: { isBanned: true },
    });

    return blogs.map((blogs) => blogs.id);
  }

  async deleteBlogById(blogId: string) {
    return await this.blogsRepository.delete({ id: blogId });
  }
}
