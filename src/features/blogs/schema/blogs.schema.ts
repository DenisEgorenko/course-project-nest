import { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

/// Types
export type BlogDocument = HydratedDocument<Blog>;

export type BlogStatics = {
  createBlog: (
    name: string,
    description: string,
    websiteUrl: string,
    blogModel: Model<BlogDocument> & BlogStatics,
  ) => BlogDocument;
};

export type BlogModel = Model<BlogDocument> & BlogStatics;

/// Schema
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

  setName(name: string) {
    this.name = name;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setWebsiteUrl(websiteUrl: string) {
    this.websiteUrl = websiteUrl;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

/// Methods
BlogSchema.methods.setName = Blog.prototype.setName;
BlogSchema.methods.setDescription = Blog.prototype.setDescription;
BlogSchema.methods.setWebsiteUrl = Blog.prototype.setWebsiteUrl;

/// Statics
BlogSchema.statics.createBlog = (
  name: string,
  description: string,
  websiteUrl: string,
  blogModel: BlogModel,
): BlogDocument => {
  return new blogModel({
    id: uuidv4(),
    name: name,
    description: description,
    websiteUrl: websiteUrl,
    createdAt: new Date(),
  });
};
