export interface Pagination<T> {
  pageNum: number;
  total: number;
  pages: number;
  pageSize: number;
  list: T[];
}
