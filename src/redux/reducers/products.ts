import { PAGE_SIZE } from "../../config/config";
import { Pagination } from "../../model/pagination";
import { Product } from "../../model/product";
import { Action, ACTION_TYPES, ProductsState } from "../typings";

let cachedProductsState = JSON.parse(
  localStorage.getItem("productsState") || "false"
);

const emptyProductsState: ProductsState = {
  products: {
    pageNum: 1,
    total: 1,
    pages: 1,
    pageSize: PAGE_SIZE,
    list: [],
  },
  isSearching: false,
  searchType: "productName",
  keyword: "",
};

//初始化LoginState，如果loaclStorage中缓存了LoginState则使用缓存值
const initState: ProductsState = cachedProductsState || emptyProductsState;

export default function productsStateReducer(
  preState: ProductsState = initState,
  action: Action<ProductsState>
): ProductsState {
  const { type, data: productsState } = action;
  switch (type) {
    case ACTION_TYPES.SAVE_PRODUCTS:
      localStorage.setItem("productsState", JSON.stringify(productsState));
      return productsState;

    default:
      return preState;
  }
}
