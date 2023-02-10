import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentDocument = HydratedDocument<Comment>;
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

// export type CommentStatics = {
//   createPost: (
//     createPostDto: CreatePostDto,
//     blogModel: Model<PostDocument> & PostStatics,
//   ) => PostDocument;
// };

export const CommentSchema = SchemaFactory.createForClass(Comment);

// PostSchema.statics.createPost = (
//   createPostDto: CreatePostDto,
//   postModel: Model<PostDocument> & PostStatics,
// ): PostDocument => {
//   return new postModel({
//     id: uuidv4(),
//     title: createPostDto.title,
//     shortDescription: createPostDto.shortDescription,
//     content: createPostDto.content,
//     blogId: createPostDto.blogId,
//     blogName: createPostDto.blogId,
//     createdAt: new Date(),
//     extendedLikesInfo: {
//       like: [],
//       dislikes: [],
//       newestLikes: [],
//     },
//   });
// };
