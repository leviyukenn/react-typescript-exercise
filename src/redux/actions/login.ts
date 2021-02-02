import { ACTION_TYPES, Action, UserInfo } from "../typings/login";

export const addUserInfo = (user: UserInfo): Action => ({
  type: ACTION_TYPES.SAVE_USERINFO,
  data: user,
});
