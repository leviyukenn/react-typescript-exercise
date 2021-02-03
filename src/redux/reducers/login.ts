//处理关于userInfo状态的reducer
import { ACTION_TYPES, Action, LoginState, UserInfo } from "../typings/login";

let cachedLoginState = JSON.parse(
  localStorage.getItem("loginState") || "false"
);

const emptyLoginState = {
  userInfo: { username: "" },
  isLogin: false,
};

//初始化LoginState，如果loaclStorage中缓存了LoginState则使用缓存值
const initState: LoginState = cachedLoginState || emptyLoginState;

export default function loginStateReducer(
  preState: LoginState = initState,
  action: Action
): LoginState {
  const { type, data: userInfo } = action;
  switch (type) {
    case ACTION_TYPES.SAVE_USERINFO:
      const newLoginState = {
        ...preState,
        userInfo: userInfo as UserInfo,
        isLogin: true,
      };
      //缓存登录信息到localStorage
      localStorage.setItem("loginState", JSON.stringify(newLoginState));

      return newLoginState;

    case ACTION_TYPES.DELETE_USERINFO:
      //清空localStorage缓存的登录信息
      localStorage.removeItem("loginState");

      //清空redux中的loginState
      return emptyLoginState;

    default:
      return preState;
  }
}
