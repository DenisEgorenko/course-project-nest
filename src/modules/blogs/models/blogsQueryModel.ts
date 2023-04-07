import { BlogDocument } from '../infrastructure/mongo/model/blogs.schema';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class BlogsQueryModel {
  @IsOptional()
  @IsString()
  pageNumber: string;
  @IsOptional()
  @IsString()
  pageSize: string;
  @IsOptional()
  @IsString()
  sortBy: string;
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortDirection: string;
  @IsOptional()
  @IsString()
  searchNameTerm: string;
}

export type queryResultType = {
  items: BlogDocument[];
  totalCount: number;
};
