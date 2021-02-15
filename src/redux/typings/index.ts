import { Product } from "../../model/product";
import { UserInfo } from "../../model/userInfo";

export enum ACTION_TYPES {
  SAVE_USERINFO = "save_userinfo",
  DELETE_USERINFO = "delete_userinfo",
  SAVE_PRODUCTS = "save_products",
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
