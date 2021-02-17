import { Product } from "../../model/product";
import { Action, ACTION_TYPES, ProductsState } from "../typings";

let cachedProductsState = JSON.parse(
  localStorage.getItem("productsState") || "false"
);

const emptyProductsState: ProductsState = {
  list: [],
};

//初始化LoginState，如果loaclStorage中缓存了LoginState则使用缓存值
const initState: ProductsState = cachedProductsState || emptyProductsState;

export default function productsStateReducer(
  preState: ProductsState = initState,
  action: Action<Product[]>
): ProductsState {
  const { type, data: productList } = action;
  switch (type) {
    case ACTION_TYPES.SAVE_PRODUCTS:
      const newProductsState = {
        ...preState,
        list: productList,
      };

      localStorage.setItem("productsState", JSON.stringify(newProductsState));
      return newProductsState;

    default:
      return preState;
  }
}
