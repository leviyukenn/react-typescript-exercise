import loginState from "./login";

import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  loginState,
});

//根据rootReducer的type生成RootState的type
export type RootState = ReturnType<typeof rootReducer>;
