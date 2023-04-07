import { BlogDocument } from '../infrastructure/mongo/model/blogs.schema';
import { BlogsQueryModel } from './blogsQueryModel';
import { BlogBaseEntity } from '../core/entity/blog.entity';

export const blogsToOutputModel = (
  query: BlogsQueryModel,
  items: BlogDocument[],
  totalCount: number,
): blogsOutputModel => {
  const pageSize: number = query.pageSize ? +query.pageSize : 10;
  const pagesCount = Math.ceil(totalCount / pageSize);
  const page: number = query.pageNumber ? +query.pageNumber : 1;

  return {
    pagesCount: pagesCount,
    page: page,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items.map((item) => blogToOutputModel(item)),
  };
};

export const blogsToOutputModelForSA = (
  query: BlogsQueryModel,
  items: BlogDocument[],
  totalCount: number,
): blogsOutputModel => {
  const pageSize: number = query.pageSize ? +query.pageSize : 10;
  const pagesCount = Math.ceil(totalCount / pageSize);
  const page: number = query.pageNumber ? +query.pageNumber : 1;

  return {
    pagesCount: pagesCount,
    page: page,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items.map((item) => blogToOutputModelForSA(item)),
  };
};

export const blogToOutputModel = (blog: BlogBaseEntity): blogOutputModel => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: false,
  };
};

export const blogToOutputModelForSA = (blog: any): blogOutputModelForSA => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: false,
    blogOwnerInfo: {
      userId: blog.user.id,
      userLogin: blog.user.login,
    },
    banInfo: {
      isBanned: blog.isBanned,
      banDate: blog.banDate,
    },
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
  isMembership: boolean;
};

export type blogOutputModelForSA = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
  blogOwnerInfo: {
    userId: string;
    userLogin: string;
  };
  banInfo: {
    isBanned: boolean;
    banDate: Date | null;
  };
};
