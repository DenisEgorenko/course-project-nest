import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateCommentDto } from '../../modules/comments/dto/createComment.dto';
import { v4 as uuidv4 } from 'uuid';

/// Types

export type CommentDocument = HydratedDocument<Comment>;

export type CommentStatics = {
  createComment: (
    createCommentDto: CreateCommentDto,
    userId: string,
    userLogin: string,
    postId: string,
    commentModel: Model<CommentDocument>,
  ) => CommentDocument;
};
export type CommentModel = Model<CommentDocument> & CommentStatics;

/// Schema

@Schema({ _id: false })
export class LikesInfo {
  @Prop({ required: true })
  likes: string[];
  @Prop({ required: true })
  dislikes: string[];
}
@Schema()
export class Comment {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  postId: string;
  @Prop({ required: true })
  userLogin: string;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true, type: LikesInfo })
  likesInfo: LikesInfo;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

/// Methods

/// Statics

CommentSchema.statics.createComment = (
  createCommentDto: CreateCommentDto,
  userId: string,
  userLogin: string,
  postId: string,
  commentModel: Model<CommentDocument>,
): CommentDocument => {
  return new commentModel({
    id: uuidv4(),
    content: createCommentDto.content,
    userId: userId,
    postId: postId,
    userLogin: userLogin,
    createdAt: new Date(),
    likesInfo: {
      likes: [],
      dislikes: [],
    },
  });
};
