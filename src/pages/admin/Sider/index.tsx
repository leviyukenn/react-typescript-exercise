import React, { useMemo } from "react";
import { Menu, Layout } from "antd";
import { useLocation } from "react-router-dom";

import { routeList, RouteItem } from "../../../config/routeConfig";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;
const { Sider } = Layout;

export default function CustomSider() {
  const location = useLocation();
  const openKeys = useMemo(
    () =>
      location.pathname.split("/").filter((path) => path && path !== "admin"),
    [location]
  );
  const selectedKey = useMemo(() => openKeys.slice(-1), [openKeys]);

  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        selectedKeys={selectedKey}
        defaultOpenKeys={openKeys}
        style={{ height: "100%", borderRight: 0 }}
      >
        {createMenuList(routeList)}
      </Menu>
    </Sider>
  );
}

function createMenuList(menuList: RouteItem[]) {
  return menuList.map((item) => {
    if (!item.children) {
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
