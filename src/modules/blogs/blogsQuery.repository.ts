import { Injectable } from '@nestjs/common';
import { BlogsQueryModel, queryResultType } from './models/blogsQueryModel';
import { Model } from 'mongoose';
import { Sort } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import {
  Blog,
  BlogDocument,
  BlogStatics,
} from './infrastructure/mongo/model/blogs.schema';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    protected blogModel: Model<BlogDocument> & BlogStatics,
  ) {}
  async getAllBlogs(
    query: BlogsQueryModel,
    bannedBlogs?: string[],
    userId?: string,
  ): Promise<queryResultType> {
    const filter: { $and: any[] } = { $and: [] };

    if (query.searchNameTerm) {
      filter.$and.push({
        name: new RegExp(query.searchNameTerm, 'i'),
      });
    }

    if (userId) {
      filter.$and.push({
        userId: new RegExp(userId, 'i'),
      });
    }

    if (!filter.$and.length) {
      filter.$and.push({});
    }

    if (bannedBlogs) {
      filter.$and.push({ id: { $nin: bannedBlogs } });
    }

    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const page: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (page - 1);

    const totalCount = await this.blogModel.countDocuments(filter);

    const items = await this.blogModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    return {
      items,
      totalCount,
    };
  }
}
