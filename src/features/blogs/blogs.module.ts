import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogsQuery.repository';
import { PostsQueryRepository } from '../posts/postsQuery.repository';
import { PostsService } from '../posts/posts.service';

@Module({
  imports: [DataBaseModule],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    PostsService,
    BlogsQueryRepository,
    PostsQueryRepository,
  ],
})
export class BlogsModule {}
