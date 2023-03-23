import { BlogDocument } from '../../../db/schemas/blogs.schema';
import { blogsQueryModel } from './blogsQueryModel';

export const blogsToOutputModel = (
  query: blogsQueryModel,
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
  query: blogsQueryModel,
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

export const blogToOutputModel = (blog: BlogDocument): blogOutputModel => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: false,
  };
};

export const blogToOutputModelForSA = (
  blog: BlogDocument,
): blogOutputModelForSA => {
  return {
    id: blog.id,
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: false,
    blogOwnerInfo: {
      userId: blog.userId,
      userLogin: blog.userLogin,
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
};
