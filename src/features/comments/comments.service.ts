import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../posts/schema/post.schema';
import { CommentDocument } from './schema/comments.schema';
import { commentToOutputModel } from './commentsQuery.repository';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Post.name)
    protected commentModel: Model<CommentDocument>,
  ) {}

  async getCommentById(id: string, userId: string) {
    const comments: CommentDocument[] = await this.commentModel.find({ id });
    if (comments.length) {
      return commentToOutputModel(comments[0], userId);
    }
  }
}
