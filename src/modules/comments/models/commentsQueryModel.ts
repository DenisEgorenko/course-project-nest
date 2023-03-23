import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class commentsQueryModel {
  @IsOptional()
  @IsNumber()
  pageNumber: number;
  @IsOptional()
  @IsNumber()
  pageSize: number;
  @IsOptional()
  @IsString()
  sortBy: string;
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDirection: string;
}
