import { ACTION_TYPES, Action, UserInfo } from "../typings/login";

export const addUserInfo = (user: UserInfo): Action => ({
  type: ACTION_TYPES.SAVE_USERINFO,
  data: user,
});

export const deleteUserInfo = (): Action => ({
  type: ACTION_TYPES.DELETE_USERINFO,
  data: undefined,
});
