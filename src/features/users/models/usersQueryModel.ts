export class usersQueryModel {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  searchLoginTerm: string;
  searchEmailTerm: string;
}
