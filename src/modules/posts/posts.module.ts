import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DataBaseModule } from '../../db/db.module';
import { PostsQueryRepository } from './postsQuery.repository';
import { CommentsQueryRepository } from '../comments/commentsQuery.repository';
import { CommentsService } from '../comments/comments.service';
import { BasicStrategy } from '../auth/strategies/basic.strategy';
import { AtJwtStrategy } from '../auth/strategies/at.jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { BlogsService } from '../blogs/blogs.service';
import { IsBlogIdExistConstraint } from './decorators/isBlogIdExistValidation.decorator';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../../application/password.service';

@Module({
  imports: [DataBaseModule],
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
    UsersService,
    PasswordService,
  ],
})
export class PostsModule {}
