import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  websiteUrl: string;
  @Prop({ required: true })
  createdAt: Date;
}

export type BlogStatics = {
  createBlog: (
    name: string,
    description: string,
    websiteUrl: string,
    blogModel: Model<BlogDocument> & BlogStatics,
  ) => BlogDocument;
};

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.statics.createBlog = (
  name: string,
  description: string,
  websiteUrl: string,
  blogModel: Model<BlogDocument> & BlogStatics,
): BlogDocument => {
  return new blogModel({
    id: uuidv4(),
    name: name,
    description: description,
    websiteUrl: websiteUrl,
    createdAt: new Date(),
  });
};
