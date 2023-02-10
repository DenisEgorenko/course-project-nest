import { HydratedDocument, Model } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CreatePostDto } from '../dto/createPost.dto';

export type PostDocument = HydratedDocument<Post>;
@Schema({ _id: false })
export class NewestLikes {
  @Prop({ required: true })
  addedAt: Date;
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  login: string;
}
@Schema({ _id: false })
export class ExtendedLikesInfo {
  @Prop({ required: true })
  likes: string[];
  @Prop({ required: true })
  dislikes: string[];

  @Prop({ required: true })
  newestLikes: NewestLikes[];
}
@Schema()
export class Post {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  shortDescription: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  blogId: string;
  @Prop({ required: true })
  blogName: string;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true, type: ExtendedLikesInfo })
  extendedLikesInfo: ExtendedLikesInfo;
}

export type PostStatics = {
  createPost: (
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogModel: Model<PostDocument> & PostStatics,
  ) => PostDocument;
};

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.statics.createPost = (
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  postModel: Model<PostDocument> & PostStatics,
): PostDocument => {
  return new postModel({
    id: uuidv4(),
    title: title,
    shortDescription: shortDescription,
    content: content,
    blogId: blogId,
    blogName: blogId,
    createdAt: new Date(),
    extendedLikesInfo: {
      like: [],
      dislikes: [],
      newestLikes: [],
    },
  });
};
