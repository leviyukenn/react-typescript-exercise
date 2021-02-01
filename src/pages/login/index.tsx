import { Layout } from "antd";

import React from "react";
import logo from "./imgs/logo.png";
import "./css/index.less";
import LoginForm from "./components/LoginForm";

const { Header, Content } = Layout;

export default function Login() {
  return (
    <Layout className="login">
      <Header className="login-header">
        <img src={logo} alt="" />
      </Header>
      <Content className="login-content">
        <LoginForm />
      </Content>
    </Layout>
  );
}
