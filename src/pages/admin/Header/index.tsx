import React from "react";
import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Menu, Button, Switch, Layout, Modal } from "antd";
import {
  LogoutOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import screenfull, { Screenfull } from "screenfull";
import { deleteUserInfo } from "../../../redux/actions/login";
import { RootState } from "../../../redux/reducers";
import logo from "../../../static/imgs/logo.png";

const { Header } = Layout;
const { confirm } = Modal;

const CustomHeader = () => {
  const loginState = useSelector((state: RootState) => state.loginState);
  const [isFullScreen, setFullScreen] = useState(false);
  const dispatch = useDispatch();
  console.log("----header----");

  useEffect(() => {
    (screenfull as Screenfull).onchange(() =>
      setFullScreen((screenfull as Screenfull).isFullscreen)
    );
  }, []);

  const { userInfo } = loginState;

  //退出登录
  const logout = useCallback(() => {
    confirm({
      title: "Logout",
      icon: <ExclamationCircleOutlined />,
      content: "Do you want to logout?",
      onOk() {
        dispatch(deleteUserInfo());
      },
    });
  }, [dispatch]);

  //切换全屏
  const toggleFullScreen = () => {
    (screenfull as Screenfull).toggle();
  };

  return (
    <Header className="header site-layout-background">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <ul className="header-buttons">
        <li>
          <Button type="link" onClick={toggleFullScreen}>
            {isFullScreen ? (
              <FullscreenExitOutlined style={{ fontSize: "20px" }} />
            ) : (
              <FullscreenOutlined style={{ fontSize: "20px" }} />
            )}
          </Button>
        </li>
        <li>
          <Switch checkedChildren="🌞" unCheckedChildren="🌛" defaultChecked />
        </li>
        <li>
          <span>{userInfo.username}</span>
        </li>
        <li>
          <Button type="link" onClick={logout}>
            <LogoutOutlined style={{ fontSize: "20px" }} />
          </Button>
        </li>
      </ul>
      <Menu
        className="header-nav"
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
      >
        <Menu.Item key="1">nav 1</Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </Header>
  );
};
export default CustomHeader;
