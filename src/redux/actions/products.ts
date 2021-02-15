import { Product } from "../../model/product";
import { ACTION_TYPES, Action } from "../typings";

export const saveProducts = (products: Product[]): Action<Product[]> => ({
  type: ACTION_TYPES.SAVE_PRODUCTS,
  data: products,
});
