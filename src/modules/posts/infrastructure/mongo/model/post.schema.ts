import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

/// Types
export type PostDocument = HydratedDocument<Post>;

export type PostStatics = {
  createPost: (
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    userId: string,
    blogModel: Model<PostDocument>,
  ) => PostDocument;
};

export type PostModel = Model<PostDocument> & PostStatics;

/// Schema
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

  @Prop({ required: true })
  userId: string;
  @Prop({ required: true, type: ExtendedLikesInfo })
  extendedLikesInfo: ExtendedLikesInfo;

  setTitle(title: string) {
    this.title = title;
  }

  setShortDescription(shortDescription: string) {
    this.shortDescription = shortDescription;
  }

  setContent(content: string) {
    this.content = content;
  }

  setBlogId(blogId: string) {
    this.blogId = blogId;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

/// Methods

PostSchema.methods.setTitle = Post.prototype.setTitle;
PostSchema.methods.setShortDescription = Post.prototype.setShortDescription;
PostSchema.methods.setContent = Post.prototype.setContent;
PostSchema.methods.setBlogId = Post.prototype.setBlogId;

/// Statics
PostSchema.statics.createPost = (
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  userId: string,
  postModel: PostModel,
): PostDocument => {
  return new postModel({
    id: uuidv4(),
    title: title,
    shortDescription: shortDescription,
    content: content,
    blogId: blogId,
    blogName: blogId,
    createdAt: new Date(),
    userId: userId,
    extendedLikesInfo: {
      like: [],
      dislikes: [],
      newestLikes: [],
    },
  });
};
