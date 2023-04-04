import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../../application/password.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Comment,
  CommentLike,
} from './infrastructure/postgreSql/model/comments.entity';
import { ICommentsRepository } from './core/abstracts/comments.repository.abstract';
import { CommentsSqlRepository } from './infrastructure/postgreSql/comments.sql.repository';
import { CreateCommentHandler } from './use-cases/createComment.useCase';
import { CqrsModule } from '@nestjs/cqrs';
import { IPostsRepository } from '../posts/core/abstracts/posts.repository.abstract';
import { PostsSqlRepository } from '../posts/infrastructure/postgreSql/posts.sql.repository';
import { Post } from '../posts/infrastructure/postgreSql/model/post.entity';
import { SetCommentLikeStatusHandler } from './use-cases/setCommentLikeStatus.useCase';
import { ICommentsLikesRepository } from './core/abstracts/commentsLikes.repository.abstract';
import { CommentsLikesSqlRepository } from './infrastructure/postgreSql/commentsLikes.sql.repository';
import { UpdateCommentHandler } from './use-cases/updateComment.useCase';
import { ICommentsQueryRepository } from './core/abstracts/commentsQuery.repository.abstract';
import { CommentsQuerySqlRepository } from './infrastructure/postgreSql/commentsQuery.sql.repository';

const handlers = [
  CreateCommentHandler,
  SetCommentLikeStatusHandler,
  UpdateCommentHandler,
];

@Module({
  imports: [
    DataBaseModule,
    UsersModule,
    TypeOrmModule.forFeature([Comment, CommentLike, Post]),
    CqrsModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    JwtService,
    PasswordService,
    { provide: ICommentsRepository, useClass: CommentsSqlRepository },
    { provide: IPostsRepository, useClass: PostsSqlRepository },
    { provide: ICommentsLikesRepository, useClass: CommentsLikesSqlRepository },
    { provide: ICommentsQueryRepository, useClass: CommentsQuerySqlRepository },

    ...handlers,
  ],
})
export class CommentsModule {}
