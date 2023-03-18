import { Module } from '@nestjs/common';
import { UsersModule } from './features/users/users.module';
import { TestingModule } from './features/testing/testing.module';
import { BlogsModule } from './features/blogs/blogs.module';
import { PostsModule } from './features/posts/posts.module';
import { CommentsModule } from './features/comments/comments.module';
import { configModule } from './configuration/configModule';
import { AuthModule } from './features/auth/auth.module';
import { SecurityModule } from './features/security/security.module';

@Module({
  imports: [
    AuthModule,
    SecurityModule,
    UsersModule,
    TestingModule,
    BlogsModule,
    PostsModule,
    CommentsModule,
    configModule,
  ],
})
export class AppModule {}
