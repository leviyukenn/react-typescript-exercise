export enum ACTION_TYPES {
  SAVE_USERINFO = "save_userinfo",
  DELETE_USERINFO = "delete_userinfo"
}

export interface Action {
  type: ACTION_TYPES;
  data: UserInfo | undefined;
}

export interface LoginState {
  userInfo: UserInfo;
  isLogin: boolean;
}

export interface UserInfo {
  username: string;
  [propName: string]: any;
}
