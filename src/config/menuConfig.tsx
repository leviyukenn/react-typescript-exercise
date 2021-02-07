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

export const menuList: MenuItem[] = [
  {
    title: "首页", // 菜单标题名称
    key: "home",
    path: "/admin/home", // 对应的path
    icon: <HomeOutlined />, // 图标名称
    isPublic: true, // 公开的
    component: <Home/>,
  },
  {
    title: "商品",
    key: "products",
    path: "/admin/products",
    icon: <AppstoreOutlined />,
    component: <Products/>,
    children: [
      // 子菜单列表
      {
        title: "品类管理",
        key: "category",
        path: "/admin/products/category",
        icon: <BarsOutlined />,
      },
      {
        title: "商品管理",
        key: "product",
        path: "/admin/products/product",
        icon: <ToolOutlined />,
      },
    ],
  },

  {
    title: "用户管理",
    key: "user",
    path: "/admin/user",
    icon: <UserOutlined />,
    component: <User/>,
  },
  {
    title: "角色管理",
    key: "role",
    path: "/admin/role",
    icon: <SafetyOutlined />,
    component: <Role/>,
  },

  {
    title: "图形图表",
    key: "charts",
    path: "/admin/charts",
    icon: <AreaChartOutlined />,
    component: <Charts/>,
    children: [
      {
        title: "柱形图",
        key: "bar",
        path: "/admin/charts/bar",
        icon: <BarChartOutlined />,
      },
      {
        title: "折线图",
        key: "line",
        path: "/admin/charts/line",
        icon: <LineChartOutlined />,
      },
      {
        title: "饼图",
        key: "pie",
        path: "/admin/charts/pie",
        icon: <PieChartOutlined />,
      },
    ],
  },

  {
    title: "订单管理",
    key: "order",
    path: "/admin/order",
    icon: <WindowsOutlined />,
  },
];

export interface MenuItem {
  title: string;
  key: string;
  path: string;
  icon: JSX.Element;
  component?: JSX.Element;
  isPublic?: boolean;
  children?: MenuItem[];
}
