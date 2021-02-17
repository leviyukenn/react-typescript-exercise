import { Category } from "../../model/category";
import { ACTION_TYPES, Action } from "../typings";

export const saveCategoryList = (category: Category[]): Action<Category[]> => ({
  type: ACTION_TYPES.SAVE_CATEGORY_LIST,
  data: category,
});
