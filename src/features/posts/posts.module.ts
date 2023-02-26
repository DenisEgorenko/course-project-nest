import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DataBaseModule } from '../../db/db.module';
import { PostsQueryRepository } from './postsQuery.repository';
import { CommentsQueryRepository } from '../comments/commentsQuery.repository';

@Module({
  imports: [DataBaseModule],
  controllers: [PostsController],
  providers: [PostsService, PostsQueryRepository, CommentsQueryRepository],
})
export class PostsModule {}
