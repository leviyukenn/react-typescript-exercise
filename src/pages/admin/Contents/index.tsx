import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout } from "antd";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
import { MenuItem, menuList } from "../../../config/menuConfig";

const { Content } = Layout;

export default function Contents() {
  const [breadCrumbs, setBreadCrumbs] = useState<MenuItem[]>([]);
  const location = useLocation();
  //通过当前路径获取所有根路径，从而生成面包屑导航
  useEffect(() => {
    const pathKeys = location.pathname
      .split("/")
      .filter((key) => key && key !== "admin");
    let childrens = menuList;
    const breadCrumbList: MenuItem[] = [];
    pathKeys.forEach((key) => {
      const menuItem = childrens.find((item) => item.key === key);
      if (!menuItem) throw new Error("no such menu item.");
      breadCrumbList.push(menuItem);
      childrens = menuItem.children || [];
    });

    setBreadCrumbs(breadCrumbList);
  }, [location]);

  return (
    <Layout className="content-container">
      <Breadcrumb className="breadcrumb" style={{ margin: "16px 0" }}>
        {breadCrumbs.map((item) => {
          return (
            <Breadcrumb.Item key={item.key}>
              <Link to={item.path}>{item.title}</Link>
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
      <Content className="site-layout-background content">
        <Switch>
          {menuList.map((item) => {
            return <Route path={item.path}>{item.component}</Route>;
          })}
          <Redirect to={menuList[0].path}></Redirect>
        </Switch>
      </Content>
    </Layout>
  );
}
