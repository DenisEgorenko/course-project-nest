import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './controllers/posts.controller';
import { DataBaseModule } from '../../db/db.module';
import { PostsQueryRepository } from './postsQuery.repository';
import { CommentsQueryRepository } from '../comments/commentsQuery.repository';
import { CommentsService } from '../comments/comments.service';
import { BasicStrategy } from '../auth/strategies/basic.strategy';
import { AtJwtStrategy } from '../auth/strategies/at.jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { BlogsService } from '../blogs/blogs.service';
import { IsBlogIdExistConstraint } from './decorators/isBlogIdExistValidation.decorator';
import { PasswordService } from '../../application/password.service';
import { UsersModule } from '../users/users.module';
import { BlogsModule } from '../blogs/blogs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post, PostLike } from './infrastructure/postgreSql/model/post.entity';
import { IPostsRepository } from './core/abstracts/posts.repository.abstract';
import { PostsSqlRepository } from './infrastructure/postgreSql/posts.sql.repository';
import { CreatePostHandler } from './use-cases/createPost.useCase';
import { IPostsQueryRepository } from './core/abstracts/postsQuery.repository.abstract';
import { PostsQuerySqlRepository } from './infrastructure/postgreSql/postsQuery.sql.repository';
import { User } from '../users/infrastructure/postgreSql/model/user.entity';
import { IPostsLikesRepository } from './core/abstracts/postsLikes.repository.abstract';
import { PostsLikesSqlRepository } from './infrastructure/postgreSql/postsLikes.sql.repository';
import { SetPostLikeStatusHandler } from './use-cases/setPostLikeStatus.useCase';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { ICommentsRepository } from '../comments/core/abstracts/comments.repository.abstract';
import { CommentsSqlRepository } from '../comments/infrastructure/postgreSql/comments.sql.repository';
import { Comment } from '../comments/infrastructure/postgreSql/model/comments.entity';
import { ICommentsQueryRepository } from '../comments/core/abstracts/commentsQuery.repository.abstract';
import { CommentsQuerySqlRepository } from '../comments/infrastructure/postgreSql/commentsQuery.sql.repository';

const handlers = [CreatePostHandler, SetPostLikeStatusHandler];
@Module({
  imports: [
    DataBaseModule,
    UsersModule,
    BlogsModule,
    TypeOrmModule.forFeature([Post, PostLike, User, Comment]),
    CqrsModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    CommentsService,
    PostsQueryRepository,
    CommentsQueryRepository,
    BasicStrategy,
    AtJwtStrategy,
    JwtService,
    BlogsService,
    BlogsService,
    IsBlogIdExistConstraint,
    PasswordService,
    {
      provide: IPostsRepository,
      useClass: PostsSqlRepository,
    },
    {
      provide: IPostsQueryRepository,
      useClass: PostsQuerySqlRepository,
    },
    {
      provide: IPostsLikesRepository,
      useClass: PostsLikesSqlRepository,
    },
    { provide: ICommentsRepository, useClass: CommentsSqlRepository },
    { provide: ICommentsQueryRepository, useClass: CommentsQuerySqlRepository },
    ...handlers,
  ],
  exports: [...handlers],
})
export class PostsModule {}
