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
import AddUpdateProduct from "../pages/admin/Contents/Products/Product/AddUpdateProduct";
import ProductDetail from "../pages/admin/Contents/Products/Product/ProductDetail";

export const routeList: RouteItem[] = [
  {
    title: "首页", // 菜单标题名称
    key: "home",
    path: "/admin/home", // 对应的path
    icon: <HomeOutlined />, // 图标名称
    isPublic: true, // 公开的
    component: <Home />,
    inNavMenu: true,
  },
  {
    title: "商品",
    key: "products",
    path: "/admin/products",
    icon: <AppstoreOutlined />,
    component: <Products />,
    inNavMenu: true,
    children: [
      // 子菜单列表
      {
        title: "品类管理",
        key: "category",
        path: "/admin/products/category",
        icon: <BarsOutlined />,
        component: <Category />,
        children: null,
        inNavMenu: true,
      },
      {
        title: "商品管理",
        key: "product",
        path: "/admin/products/product",
        icon: <ToolOutlined />,
        component: <Product />,
        inNavMenu: true,
        notListChildren: true,
        exact: true,
        children: [
          // 子菜单列表
          {
            title: "添加商品",
            key: "addProduct",
            path: "/admin/products/product/addProduct",
            component: <AddUpdateProduct />,
            children: null,
            inNavMenu: false,
          },
          {
            title: "修改商品信息",
            key: "updateProduct",
            path: "/admin/products/product/updateProduct",
            component: <AddUpdateProduct />,
            children: null,
            inNavMenu: false,
          },
          {
            title: "商品详细",
            key: "productDetail",
            path: "/admin/products/product/productDetail",
            component: <ProductDetail />,
            children: null,
            inNavMenu: false,
          },
        ],
      },
    ],
  },

  {
    title: "用户管理",
    key: "user",
    path: "/admin/user",
    icon: <UserOutlined />,
    component: <User />,
    inNavMenu: true,
  },
  {
    title: "角色管理",
    key: "role",
    path: "/admin/role",
    icon: <SafetyOutlined />,
    component: <Role />,
    inNavMenu: true,
  },

  {
    title: "图形图表",
    key: "charts",
    path: "/admin/charts",
    icon: <AreaChartOutlined />,
    component: <Charts />,
    inNavMenu: true,
    children: [
      {
        title: "柱形图",
        key: "bar",
        path: "/admin/charts/bar",
        icon: <BarChartOutlined />,
        inNavMenu: true,
        children: null,
      },
      {
        title: "折线图",
        key: "line",
        path: "/admin/charts/line",
        icon: <LineChartOutlined />,
        inNavMenu: true,
        children: null,
      },
      {
        title: "饼图",
        key: "pie",
        path: "/admin/charts/pie",
        icon: <PieChartOutlined />,
        inNavMenu: true,
        children: null,
      },
    ],
  },

  {
    title: "订单管理",
    key: "order",
    path: "/admin/order",
    icon: <WindowsOutlined />,
    inNavMenu: true,
    children: null,
  },
];

export interface RouteItem {
  title: string;
  key: string;
  path: string;
  icon?: JSX.Element;
  inNavMenu: boolean;
  notListChildren?: boolean;
  component?: JSX.Element;
  isPublic?: boolean;
  children?: RouteItem[] | null;
  exact?: boolean;
}
