//处理关于userInfo状态的reducer
import { ACTION_TYPES, Action, LoginState } from "../typings/login";

let cachedLoginState = JSON.parse(
  localStorage.getItem("loginState") || "false"
);

//初始化LoginState，如果loaclStorage中缓存了LoginState则使用缓存值
const initState: LoginState = cachedLoginState || {
  userInfo: { username: "" },
  isLogin: false,
};

export default function loginStateReducer(
  preState: LoginState = initState,
  action: Action
): LoginState {
  const { type, data: userInfo } = action;
  switch (type) {
    case ACTION_TYPES.SAVE_USERINFO:
      const newLoginState = {
        ...preState,
        userInfo: userInfo,
        isLogin: true,
      };
      //缓存登录信息到localStorage
      localStorage.setItem("loginState", JSON.stringify(newLoginState));

      return newLoginState;

    default:
      return preState;
  }
}
