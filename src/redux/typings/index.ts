import { Category } from "../../model/category";
import { Pagination } from "../../model/pagination";
import { Product } from "../../model/product";
import { UserInfo } from "../../model/userInfo";

export enum ACTION_TYPES {
  SAVE_USERINFO = "save_userinfo",
  DELETE_USERINFO = "delete_userinfo",
  SAVE_PRODUCTS = "save_products",
  SAVE_CATEGORY_LIST = "save_category_list",
  GOBACK_PRODUCTS_PAGE = "goback_products_page",
}

export interface Action<T> {
  type: ACTION_TYPES;
  data: T;
}

export interface LoginState {
  userInfo: UserInfo;
  isLogin: boolean;
}

export interface ProductsState {
  products: Pagination<Product>;
  isSearching: boolean;
  searchType: string;
  keyword: string;
}

export interface CategoryState {
  list: Category[];
}
