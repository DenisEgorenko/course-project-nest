export type blogsQueryModel = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  searchNameTerm: string;
};
