import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Blog,
  BlogDocument,
  BlogModel,
  BlogStatics,
} from '../../db/schemas/blogs.schema';
import {
  User,
  UserDocument,
  UserModel,
  UserStatics,
} from '../../db/schemas/user.schema';
import {
  Post,
  PostDocument,
  PostModel,
  PostStatics,
} from '../../db/schemas/post.schema';
import { Security, SecurityModel } from '../../db/schemas/security.schema';

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
