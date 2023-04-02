import { BlogDocument } from '../infrastructure/mongo/model/blogs.schema';

export type blogsQueryModel = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  searchNameTerm: string;
};

export type queryResultType = {
  items: BlogDocument[];
  totalCount: number;
};
