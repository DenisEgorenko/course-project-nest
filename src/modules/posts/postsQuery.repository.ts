import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sort } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostStatics } from '../../db/schemas/post.schema';
import { postsQueryModel } from './models/postsQueryModel';
import { Blog, BlogDocument } from '../../db/schemas/blogs.schema';
import { postsToOutputModel } from './models/postsToViewModel';

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
  ) {
    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const totalCount = await this.postModel.countDocuments({
      userId: { $nin: bannedUsers },
    });
    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await this.postModel
      .find({})
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    const notBannedItems = items.filter(
      (item) => !bannedUsers.includes(item.userId),
    );

    return postsToOutputModel(
      pagesCount,
      pageNumber,
      pageSize,
      totalCount,
      notBannedItems,
      userId,
      bannedUsers,
    );
  }

  async getAllBlogsPosts(
    blogId: string,
    query: postsQueryModel,
    userId: string,
  ) {
    const blog: BlogDocument[] = await this.blogModel.find({ id: blogId });
    console.log(blogId);
    if (!blog.length) {
      throw new NotFoundException('no such blog');
    }

    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const totalCount = await this.postModel.countDocuments({ blogId: blogId });
    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await this.postModel
      .find({ blogId: blogId })
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    return postsToOutputModel(
      pagesCount,
      pageNumber,
      pageSize,
      totalCount,
      items,
      userId,
      [],
    );
  }
}
