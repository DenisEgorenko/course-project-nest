import { IsIn, IsOptional, IsString } from 'class-validator';

export class PostsQueryModel {
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
  @IsIn(['asc', 'desc'])
  sortDirection: string;
}
