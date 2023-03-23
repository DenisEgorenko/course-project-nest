import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TestingModule } from './modules/testing/testing.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { configModule } from './config/configModule';
import { AuthModule } from './modules/auth/auth.module';
import { SecurityModule } from './modules/security/security.module';

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
