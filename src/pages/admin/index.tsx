import React from "react";
import { useSelector } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from "antd";

import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

import { reqCategory } from "../../api/requests";
import { RootState } from "../../redux/reducers";
import "./css/admin.less";
import Header from "./Header";

const { SubMenu } = Menu;
const { Content, Sider, Footer } = Layout;

export default function Admin(props: RouteComponentProps) {
  const loginState = useSelector((state: RootState) => state.loginState);
  const { isLogin } = loginState;

  const getCategoryList = async () => {
    let list = await reqCategory();
    console.log(list);
  };

  //如果没登录则重定向回login界面
  if (!isLogin) {
    return <Redirect to="/login" />;
  }

  return (
    <Layout className="admin">
      <Header />
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
              <Menu.Item key="5">option5</Menu.Item>
              <Menu.Item key="6">option6</Menu.Item>
              <Menu.Item key="7">option7</Menu.Item>
              <Menu.Item key="8">option8</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub3"
              icon={<NotificationOutlined />}
              title="subnav 3"
            >
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout className="content-container">
          <Breadcrumb className="breadcrumb" style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content className="site-layout-background content">Content</Content>
        </Layout>
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
