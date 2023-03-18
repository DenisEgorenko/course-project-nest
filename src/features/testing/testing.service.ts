import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Blog,
  BlogDocument,
  BlogModel,
  BlogStatics,
} from '../blogs/schema/blogs.schema';
import {
  User,
  UserDocument,
  UserModel,
  UserStatics,
} from '../users/schema/user.schema';
import {
  Post,
  PostDocument,
  PostModel,
  PostStatics,
} from '../posts/schema/post.schema';
import { Security, SecurityModel } from '../security/schema/security.schema';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(User.name)
    protected userModel: UserModel,
    @InjectModel(Blog.name)
    protected blogModel: BlogModel,

    @InjectModel(Post.name)
    protected postModel: PostModel,
    @InjectModel(Security.name)
    protected securityModel: SecurityModel,
  ) {}

  async deleteAllData() {
    await this.userModel.deleteMany({});
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.securityModel.deleteMany({});
  }
}
