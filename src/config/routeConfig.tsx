import {
  ToolOutlined,
  BarsOutlined,
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
  SafetyOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  WindowsOutlined,
} from "@ant-design/icons";

import Home from "../pages/admin/Contents/Home";
import Products from "../pages/admin/Contents/Products";
import User from "../pages/admin/Contents/User";
import Role from "../pages/admin/Contents/Role";
import Charts from "../pages/admin/Contents/Charts";
import Category from "../pages/admin/Contents/Products/Category";
import Product from "../pages/admin/Contents/Products/Product";

export const routeList: RouteItem[] = [
  {
    title: "首页", // 菜单标题名称
    key: "home",
    path: "/admin/home", // 对应的path
    icon: <HomeOutlined />, // 图标名称
    isPublic: true, // 公开的
    component: <Home />,
  },
  {
    title: "商品",
    key: "products",
    path: "/admin/products",
    icon: <AppstoreOutlined />,
    component: <Products />,
    children: [
      // 子菜单列表
      {
        title: "品类管理",
        key: "category",
        path: "/admin/products/category",
        icon: <BarsOutlined />,
        component: <Category />,
        children: null,
      },
      {
        title: "商品管理",
        key: "product",
        path: "/admin/products/product",
        icon: <ToolOutlined />,
        component: <Product />,
        children: null,
      },
    ],
  },

  {
    title: "用户管理",
    key: "user",
    path: "/admin/user",
    icon: <UserOutlined />,
    component: <User />,
  },
  {
    title: "角色管理",
    key: "role",
    path: "/admin/role",
    icon: <SafetyOutlined />,
    component: <Role />,
  },

  {
    title: "图形图表",
    key: "charts",
    path: "/admin/charts",
    icon: <AreaChartOutlined />,
    component: <Charts />,
    children: [
      {
        title: "柱形图",
        key: "bar",
        path: "/admin/charts/bar",
        icon: <BarChartOutlined />,
        children: null,
      },
      {
        title: "折线图",
        key: "line",
        path: "/admin/charts/line",
        icon: <LineChartOutlined />,
        children: null,
      },
      {
        title: "饼图",
        key: "pie",
        path: "/admin/charts/pie",
        icon: <PieChartOutlined />,
        children: null,
      },
    ],
  },

  {
    title: "订单管理",
    key: "order",
    path: "/admin/order",
    icon: <WindowsOutlined />,
    children: null,
  },
];

export interface RouteItem {
  title: string;
  key: string;
  path: string;
  icon: JSX.Element;
  component?: JSX.Element;
  isPublic?: boolean;
  children?: RouteItem[] | null;
}
