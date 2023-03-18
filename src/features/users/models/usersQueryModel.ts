import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class usersQueryModel {
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
  @IsString()
  @IsIn(['asc', 'desc'])
  sortDirection: string;
  @IsOptional()
  @IsString()
  searchLoginTerm: string;
  @IsOptional()
  @IsString()
  searchEmailTerm: string;
}
