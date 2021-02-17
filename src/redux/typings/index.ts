import { Category } from "../../model/category";
import { Product } from "../../model/product";
import { UserInfo } from "../../model/userInfo";

export enum ACTION_TYPES {
  SAVE_USERINFO = "save_userinfo",
  DELETE_USERINFO = "delete_userinfo",
  SAVE_PRODUCTS = "save_products",
  SAVE_CATEGORY_LIST = "save_category_list",
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
  list: Product[];
}

export interface CategoryState {
  list: Category[];
}
