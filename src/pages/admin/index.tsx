import React from "react";
import { useSelector } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Layout } from "antd";

import { RootState } from "../../redux/reducers";
import "./css/admin.less";
import Header from "./Header";
import Sider from "./Sider";
import Contents from "./Contents";

const { Footer } = Layout;

export default function Admin(props: RouteComponentProps) {
  const loginState = useSelector((state: RootState) => state.loginState);
  const { isLogin } = loginState;

  //如果没登录则重定向回login界面
  if (!isLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <Layout className="admin">
      <Header />
      <Layout>
        <Sider />
        <Contents />
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
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
