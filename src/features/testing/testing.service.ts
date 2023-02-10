import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument, BlogStatics } from '../blogs/schema/blogs.schema';
import { User, UserDocument, UserStatics } from '../users/schema/user.schema';
import {
  Post,
  PostDocument,
  PostStatics,
} from '../../posts/schema/post.schema';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(User.name)
    protected userModel: Model<UserDocument> & UserStatics,
    @InjectModel(Blog.name)
    protected blogModel: Model<BlogDocument> & BlogStatics,

    @InjectModel(Post.name)
    protected postModel: Model<PostDocument> & PostStatics,
  ) {}

  async deleteAllData() {
    await this.userModel.deleteMany({});
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
  }
}
