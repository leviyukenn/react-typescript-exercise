//服务器返回的状态码
export enum RESPONSE_STATUS {
  SUCCESS = 0,
  FAILED = 1,
}

export interface Response<T> {
  status: number;
  data?: T;
  msg?: string;
}

export interface Category {
  _id: string;
  name: string;
  [propName: string]: any;
}

export interface ProductsPerPage extends Pagination {
  list: Product[];
}

export interface Product {
  status: number;
  _id: string;
  name: string;
  desc: string;
  price: number;
}

export interface Pagination {
  pageNum: number;
  total: number;
  pages: number;
  pageSize: number;
}
