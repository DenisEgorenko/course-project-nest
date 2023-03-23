import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class usersQueryModel {
  @IsOptional()
  @IsString()
  @IsIn(['all', 'banned', 'notBanned'])
  banStatus: string;
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
  @IsOptional()
  @IsString()
  searchEmailTerm: string;
}
