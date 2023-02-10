import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { User, UserSchema } from '../features/users/schema/user.schema';
import { Blog, BlogSchema } from '../features/blogs/schema/blogs.schema';
import { Post, PostSchema } from '../posts/schema/post.schema';
import {
  Comment,
  CommentSchema,
} from '../features/comments/schema/comments.schema';

dotenv.config();

const url = process.env.MONGO_URL;

console.log('database url: ', url);

if (!url) {
  throw new Error('URL does not found');
}

@Module({
  imports: [
    MongooseModule.forRoot(url),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
  exports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
  ],
})
export class DataBaseModule {}
