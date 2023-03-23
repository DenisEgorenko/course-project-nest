import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sort } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostStatics } from '../../db/schemas/post.schema';
import { postsQueryModel } from './models/postsQueryModel';
import { Blog, BlogDocument } from '../../db/schemas/blogs.schema';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    protected postModel: Model<PostDocument> & PostStatics,

    @InjectModel(Blog.name)
    protected blogModel: Model<BlogDocument>,
  ) {}
  async getAllPosts(
    query: postsQueryModel,
    userId: string,
    bannedUsers: string[],
    blogId?: string,
  ) {
    let filter = {};

    if (blogId) {
      filter = { blogId: blogId };
    }
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const totalCount = await this.postModel.countDocuments({
      filter,
      userId: { $nin: bannedUsers },
    });

    const allItems = await this.postModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    const items = allItems.filter((item) => !bannedUsers.includes(item.userId));
    return { items, totalCount };
  }
}
