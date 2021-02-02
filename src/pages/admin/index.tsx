import React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { ReduxState } from "../../redux/typings";
import { LoginState } from "../../redux/typings/login";

function Admin(props: PropsType) {
  const {
    loginState: { userInfo, isLogin },
  } = props;

  //如果没登录则重定向回login界面
  if (!isLogin) {
    return <Redirect to="/login" />;
  }

  return <div>hello,{userInfo.username}</div>;
}

interface PropsType extends RouteComponentProps {
  loginState: LoginState;
}

export default connect((state: ReduxState) => ({
  loginState: state.loginState,
}))(Admin);
