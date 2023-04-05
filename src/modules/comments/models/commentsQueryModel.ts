import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CommentsQueryModel {
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
