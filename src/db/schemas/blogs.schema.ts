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
    userId?: string,
    userLogin?: string,
  ) => BlogDocument;
};

export type BlogModel = Model<BlogDocument> & BlogStatics;

/// Schema
@Schema()
export class Blog {
  @Prop({ required: true })
  id: string;
  @Prop({ required: false })
  userId: string | null;
  @Prop({ required: false })
  userLogin: string | null;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  websiteUrl: string;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true })
  isBanned: boolean;

  @Prop({ required: false })
  banDate: Date | null;

  setName(name: string) {
    this.name = name;
  }

  setDescription(description: string) {
    this.description = description;
  }

  setWebsiteUrl(websiteUrl: string) {
    this.websiteUrl = websiteUrl;
  }

  setIsBanned(isBanned: boolean) {
    this.isBanned = isBanned;
  }

  setBannedDate(date: Date) {
    this.banDate = date;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

/// Methods
BlogSchema.methods.setName = Blog.prototype.setName;
BlogSchema.methods.setDescription = Blog.prototype.setDescription;
BlogSchema.methods.setWebsiteUrl = Blog.prototype.setWebsiteUrl;
BlogSchema.methods.setIsBanned = Blog.prototype.setIsBanned;
BlogSchema.methods.setBannedDate = Blog.prototype.setBannedDate;

/// Statics
BlogSchema.statics.createBlog = (
  name: string,
  description: string,
  websiteUrl: string,
  blogModel: BlogModel,
  userId?: string,
  userLogin?: string,
): BlogDocument => {
  return new blogModel({
    id: uuidv4(),
    userId: userId || null,
    userLogin: userLogin || null,
    name: name,
    description: description,
    websiteUrl: websiteUrl,
    createdAt: new Date(),
    isBanned: false,
    banDate: null,
  });
};
