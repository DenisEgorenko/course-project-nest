import { Injectable, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../features/users/schema/user.schema';
import { Blog, BlogSchema } from '../features/blogs/schema/blogs.schema';
import { Post, PostSchema } from '../features/posts/schema/post.schema';
import {
  Comment,
  CommentSchema,
} from '../features/comments/schema/comments.schema';
import { ConfigService } from '@nestjs/config';
import {
  Security,
  SecuritySchema,
} from '../features/security/schema/security.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongo_uri'),
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: Security.name, schema: SecuritySchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: Security.name, schema: SecuritySchema },
    ]),
  ],
})
export class DataBaseModule {}
