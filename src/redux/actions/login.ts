import { UserInfo } from "../../model/userInfo";
import { ACTION_TYPES, Action } from "../typings";

export const addUserInfo = (user: UserInfo): Action<UserInfo | undefined> => ({
  type: ACTION_TYPES.SAVE_USERINFO,
  data: user,
});

export const deleteUserInfo = (): Action<UserInfo | undefined> => ({
  type: ACTION_TYPES.DELETE_USERINFO,
  data: undefined,
});
