import { Category } from "../../model/category";
import { Action, ACTION_TYPES, CategoryState } from "../typings";

export default function CategoryStateReducer(
  preState: CategoryState = { list: [] },
  action: Action<Category[]>
): CategoryState {
  const { type, data: categoryList } = action;
  switch (type) {
    case ACTION_TYPES.SAVE_CATEGORY_LIST:
      const newCategoryState = {
        ...preState,
        list: categoryList,
      };

      return newCategoryState;

    default:
      return preState;
  }
}
