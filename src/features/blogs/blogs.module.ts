import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../db/db.module';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsQueryRepository } from './blogsQuery.repository';
import { PostsQueryRepository } from '../posts/postsQuery.repository';
import { PostsService } from '../posts/posts.service';
import { BasicStrategy } from '../auth/strategies/basic.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DataBaseModule],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    PostsService,
    BlogsQueryRepository,
    PostsQueryRepository,
    BasicStrategy,
    JwtService,
  ],
})
export class BlogsModule {}
