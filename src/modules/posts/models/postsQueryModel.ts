export type PostsQueryModel = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
};
