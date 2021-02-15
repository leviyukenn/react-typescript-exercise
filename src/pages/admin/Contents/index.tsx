import React, { useEffect, useState } from "react";
import { Breadcrumb, Layout } from "antd";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
import { RouteItem, routeList } from "../../../config/routeConfig";

const { Content } = Layout;

function useBreadCrumbs(): RouteItem[] {
  const [breadCrumbs, setBreadCrumbs] = useState<RouteItem[]>([]);
  const location = useLocation();
  //通过当前路径获取所有根路径，从而生成面包屑导航
  useEffect(() => {
    const pathKeys = location.pathname
      .split("/")
      .filter((key) => key && key !== "admin");
    let childrens = routeList;
    const breadCrumbList: RouteItem[] = [];
    pathKeys.forEach((key) => {
      if (childrens.length === 0) return;
      const menuItem = childrens.find((item) => item.key === key);
      if (!menuItem) {
        childrens = [];
        return;
      }
      breadCrumbList.push(menuItem);
      childrens = menuItem.children || [];
    });

    setBreadCrumbs(breadCrumbList);
  }, [location]);

  return breadCrumbs;
}

export default function Contents() {
  const breadCrumbs = useBreadCrumbs();

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
          {routeList.map((item) => {
            return (
              <Route key={item.key} path={item.path}>
                {item.component}
              </Route>
            );
          })}
          <Redirect to={routeList[0].path}></Redirect>
        </Switch>
      </Content>
    </Layout>
  );
}
