import React, { useMemo } from "react";
import { Menu, Layout } from "antd";
import { useLocation } from "react-router-dom";

import { routeList, RouteItem } from "../../../config/routeConfig";
import { Link } from "react-router-dom";
import { RootState } from "../../../redux/reducers";
import { useSelector } from "react-redux";

const { SubMenu } = Menu;
const { Sider } = Layout;

export default function CustomSider() {
  const location = useLocation();
  const loginState = useSelector((state: RootState) => state.loginState);

  const openKeys = useMemo(
    () =>
      location.pathname.split("/").filter((path) => path && path !== "admin"),
    [location]
  );
  //   const selectedKey = useMemo(() => openKeys.slice(-1), [openKeys]);

  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        selectedKeys={openKeys}
        defaultOpenKeys={openKeys}
        style={{ height: "100%", borderRight: 0 }}
      >
        {createMenuList(routeList, loginState.userInfo.role?.menus)}
      </Menu>
    </Sider>
  );
}

function createMenuList(menuList: RouteItem[], authList?: string[]) {
  return menuList.map((item) => {
    if (authList && !hasAuth(item, authList)) {
      return null;
    }
    if (!item.inNavMenu) return null;
    if (!item.children || item.notListChildren) {
      return (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.path}>{item.title}</Link>
        </Menu.Item>
      );
    } else {
      return (
        <SubMenu key={item.key} icon={item.icon} title={item.title}>
          {createMenuList(item.children)}
        </SubMenu>
      );
    }
  });
}

function hasAuth(menuItem: RouteItem, authList: string[]): boolean {
  if (authList.length === 0) return false;
  const isPermitted = !!authList.find((authItem) => authItem === menuItem.key);
  if (isPermitted) return isPermitted;

  if (!menuItem.children || menuItem.children.length === 0) {
    return isPermitted;
  } else {
    return menuItem.children.some((item) => hasAuth(item, authList));
  }
}
