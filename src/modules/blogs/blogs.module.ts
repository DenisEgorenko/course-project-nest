import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { BlogsController } from './controllers/blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogsQuery.repository';
import { PostsQueryRepository } from '../posts/postsQuery.repository';
import { PostsService } from '../posts/posts.service';
import { BasicStrategy } from '../auth/strategies/basic.strategy';
import { JwtService } from '@nestjs/jwt';
import { BlogsBloggerController } from './controllers/blogs.blogger.controller';
import { BlogsSaController } from './controllers/blogs.sa.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteBlogHandler } from './use-cases/deleteBlog.useCase';
import { UpdateBlogHandler } from './use-cases/updateBlog.useCase';
import { CreateBlogHandler } from './use-cases/createBlog.useCase';
import { CreateBlogPostHandler } from './use-cases/createBlogPost.useCase';
import { UpdateBlogPostHandler } from './use-cases/updateBlogPost.useCase';
import { DeleteBlogPostHandler } from './use-cases/deleteBlogPost.useCase';
import { PasswordService } from '../../application/password.service';
import { BanBlogHandler } from './use-cases/banBlog.useCase';
import { AllBloggerCommentsQueryRepository } from '../comments/allBloggerCommentsQuery.repository';
import { UsersModule } from '../users/users.module';

const handlers = [
  UpdateBlogHandler,
  DeleteBlogHandler,
  CreateBlogHandler,
  CreateBlogPostHandler,
  UpdateBlogPostHandler,
  DeleteBlogPostHandler,
  BanBlogHandler,
];
@Module({
  imports: [DataBaseModule, CqrsModule, UsersModule],
  controllers: [BlogsController, BlogsBloggerController, BlogsSaController],
  providers: [
    BlogsService,
    PostsService,
    BlogsQueryRepository,
    PostsQueryRepository,
    BasicStrategy,
    JwtService,
    PasswordService,
    AllBloggerCommentsQueryRepository,
    ...handlers,
  ],
})
export class BlogsModule {}
