import { Injectable } from '@nestjs/common';
import { blogsQueryModel } from './models/blogsQueryModel';
import { Model } from 'mongoose';
import { Sort } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogStatics } from './schema/blogs.schema';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    protected blogModel: Model<BlogDocument> & BlogStatics,
  ) {}
  async getAllBlogs(query: blogsQueryModel) {
    const filter = query.searchNameTerm
      ? { name: new RegExp(query.searchNameTerm, 'i') }
      : {};

    const sortBy = query.sortBy ? query.sortBy : 'createdAt';
    const sortDirection: Sort = query.sortDirection === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortDirection };

    const pageSize: number = query.pageSize ? +query.pageSize : 10;
    const pageNumber: number = query.pageNumber ? +query.pageNumber : 1;

    const skip: number = pageSize * (pageNumber - 1);

    const totalCount = await this.blogModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    const items = await this.blogModel
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    return blogsToOutputModel(
      pagesCount,
      pageNumber,
      pageSize,
      totalCount,
      items,
    );
  }
}

export const blogsToOutputModel = (
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: BlogDocument[],
): blogsOutputModel => {
  return {
    pagesCount: pagesCount,
    page: page,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items.map((item) => blogToOutputModel(item)),
  };
};

export const blogToOutputModel = (blog: BlogDocument): blogOutputModel => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
  };
};

export type blogsOutputModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: blogOutputModel[];
};

export type blogOutputModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
};
