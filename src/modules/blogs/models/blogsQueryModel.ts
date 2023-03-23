import { BlogDocument } from '../../../db/schemas/blogs.schema';

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
