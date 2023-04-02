import { Injectable } from '@nestjs/common';
import { IBlogsRepository } from './core/abstracts/blogs.repository.abstract';
import { BlogsBannedUsersQueryModel } from './models/blogsBannedUsersQueryModel';
import { IBlogsBannedUsersRepository } from './core/abstracts/blogsBannedUsers.repository.abstract';
import { blogsQueryModel } from './models/blogsQueryModel';
import { IBlogsQueryRepository } from './core/abstracts/blogsQuery.repository.abstract';

@Injectable()
export class BlogsService {
  constructor(
    protected blogRepository: IBlogsRepository,
    protected blogsBannedUsersRepository: IBlogsBannedUsersRepository,
    protected blogsQuerySqlRepository: IBlogsQueryRepository,
  ) {}

  async getBlogById(id: string) {
    return this.blogRepository.getBlogById(id);
  }

  async getAllBannedBlogsIds() {
    return this.blogRepository.getAllBannedBlogsIds();
  }

  async getAllBannedUsersForBlog(
    query: BlogsBannedUsersQueryModel,
    blogId: string,
  ) {
    return await this.blogsBannedUsersRepository.findAllBannedUsersForBlog(
      query,
      blogId,
    );
  }

  async getAllBlogs(
    query: blogsQueryModel,
    showBanned: boolean,
    userId?: string,
  ) {
    return await this.blogsQuerySqlRepository.getAllBlogs(
      query,
      showBanned,
      userId,
    );
  }
}
