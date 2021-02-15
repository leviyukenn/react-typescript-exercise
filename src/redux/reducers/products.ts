import { Product } from "../../model/product";
import { Action, ACTION_TYPES, ProductsState } from "../typings";

export default function loginStateReducer(
  preState: ProductsState = { list: [] },
  action: Action<Product[]>
): ProductsState {
  const { type, data: productList } = action;
  switch (type) {
    case ACTION_TYPES.SAVE_PRODUCTS:
      const newProductsState = {
        ...preState,
        list: productList,
      };
      return newProductsState;

    default:
      return preState;
  }
}
