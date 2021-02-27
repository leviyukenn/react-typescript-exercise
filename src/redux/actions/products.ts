import { ACTION_TYPES, Action, ProductsState } from "../typings";

export const saveProductsState = (
  productsState: ProductsState
): Action<ProductsState> => ({
  type: ACTION_TYPES.SAVE_PRODUCTS,
  data: productsState,
});
