import loginState from "./login";
import productsState from "./products";
import categoryState from "./category";

import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  loginState,
  productsState,
  categoryState,
});

//根据rootReducer的type生成RootState的type
export type RootState = ReturnType<typeof rootReducer>;
