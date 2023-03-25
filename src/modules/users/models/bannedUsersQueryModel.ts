import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class bannedUsersQueryModel {
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
  searchLoginTerm: string;
}
