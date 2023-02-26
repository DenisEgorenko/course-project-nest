import { Module } from '@nestjs/common';
import { UsersModule } from './features/users/users.module';
import { TestingModule } from './features/testing/testing.module';
import { BlogsModule } from './features/blogs/blogs.module';
import { PostsModule } from './features/posts/posts.module';
import { CommentsModule } from './features/comments/comments.module';

@Module({
  imports: [
    UsersModule,
    TestingModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
  ],
})
export class AppModule {}
