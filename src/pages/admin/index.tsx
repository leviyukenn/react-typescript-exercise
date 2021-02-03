import React, { useCallback } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";

import { deleteUserInfo } from "../../redux/actions/login";
import { RootState } from "../../redux/reducers";

export default function Admin(props: RouteComponentProps) {
  const loginState = useSelector((state: RootState) => state.loginState);
  const dispatch = useDispatch();

  const { userInfo, isLogin } = loginState;

  const logout = useCallback(() => {
    dispatch(deleteUserInfo());
  }, []);

  //如果没登录则重定向回login界面
  if (!isLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      hello,{userInfo.username}
      <button onClick={logout}>logout</button>
    </div>
  );
}

// interface PropsType extends RouteComponentProps {
//   loginState: LoginState;
//   deleteUserInfo: typeof deleteUserInfo;
// }

// export default connect(
//   (state: RootState) => ({
//     loginState: state.loginState,
//   }),
//   { deleteUserInfo }
// )(Admin);
