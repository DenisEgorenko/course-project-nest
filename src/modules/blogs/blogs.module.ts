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
import { UpdateBlogPostHandler } from '../posts/use-cases/updateBlogPost.useCase';
import { DeleteBlogPostHandler } from './use-cases/deleteBlogPost.useCase';
import { PasswordService } from '../../application/password.service';
import { BanBlogHandler } from './use-cases/banBlog.useCase';
import { AllBloggerCommentsQueryRepository } from '../comments/allBloggerCommentsQuery.repository';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './infrastructure/postgreSql/model/blog.entity';
import { IBlogsRepository } from './core/abstracts/blogs.repository.abstract';
import { BlogsSqlRepository } from './infrastructure/postgreSql/blogs.sql.repository';
import { IBlogsBanInfoRepository } from './core/abstracts/blogsBanInfo.repository.abstract';
import { BlogsBanInfoSqlRepository } from './infrastructure/postgreSql/blogsBanInfo.sql.repository';
import { BlogsBanInfo } from '../users/infrastructure/postgreSql/model/user.entity';
import { IBlogsBannedUsersRepository } from './core/abstracts/blogsBannedUsers.repository.abstract';
import { BlogsBannedUsersQuerySqlRepository } from './infrastructure/postgreSql/blogsBannedUsersQuery.sql.repository';
import { IBlogsQueryRepository } from './core/abstracts/blogsQuery.repository.abstract';
import { BlogsQuerySqlRepository } from './infrastructure/postgreSql/blogsQuery.sql.repository';
import { IPostsRepository } from '../posts/core/abstracts/posts.repository.abstract';
import { PostsSqlRepository } from '../posts/infrastructure/postgreSql/posts.sql.repository';
import { Post } from '../posts/infrastructure/postgreSql/model/post.entity';
import { IPostsQueryRepository } from '../posts/core/abstracts/postsQuery.repository.abstract';
import { PostsQuerySqlRepository } from '../posts/infrastructure/postgreSql/postsQuery.sql.repository';

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
  imports: [
    DataBaseModule,
    CqrsModule,
    UsersModule,
    TypeOrmModule.forFeature([Blog, BlogsBanInfo, Post]),
  ],
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
    { provide: IBlogsRepository, useClass: BlogsSqlRepository },
    {
      provide: IBlogsBanInfoRepository,
      useClass: BlogsBanInfoSqlRepository,
    },
    {
      provide: IBlogsBannedUsersRepository,
      useClass: BlogsBannedUsersQuerySqlRepository,
    },
    {
      provide: IBlogsQueryRepository,
      useClass: BlogsQuerySqlRepository,
    },
    {
      provide: IPostsRepository,
      useClass: PostsSqlRepository,
    },
    {
      provide: IPostsQueryRepository,
      useClass: PostsQuerySqlRepository,
    },
    ...handlers,
  ],
  exports: [
    { provide: IBlogsRepository, useClass: BlogsSqlRepository },
    {
      provide: IBlogsBanInfoRepository,
      useClass: BlogsBanInfoSqlRepository,
    },
    {
      provide: IBlogsBannedUsersRepository,
      useClass: BlogsBannedUsersQuerySqlRepository,
    },
    {
      provide: IBlogsQueryRepository,
      useClass: BlogsQuerySqlRepository,
    },
    BlogsService,
  ],
})
export class BlogsModule {}
