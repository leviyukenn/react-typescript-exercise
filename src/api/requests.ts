import { PAGE_SIZE } from "../config/config";
import myAxios from "./myAxios";
import { AddProductParams, Response, UpdateProductParams } from "./types";
import { Product } from "../model/product";
import { Category } from "../model/category";
import { Pagination } from "../model/pagination";
import { Role } from "../model/role";

export async function reqLogin(username: string, password: string) {
  return myAxios.post("/login", {
    username: username,
    password: password,
  });
}

export async function reqCategoryList(
  parentId: string = "0"
): Promise<Response<Category[]>> {
  return myAxios.get("/manage/category/list", { params: { parentId } });
}

export async function reqAddCategory(
  categoryName: string,
  parentId: string = "0"
): Promise<Response<Category>> {
  return myAxios.post("/manage/category/add", {
    parentId: parentId,
    categoryName: categoryName,
  });
}

export async function reqUpdateCategory(
  categoryId: string,
  categoryName: string
): Promise<Response<Category>> {
  return myAxios.post("/manage/category/update", {
    categoryId,
    categoryName,
  });
}

export async function reqProductsPerPage(
  pageNum: number,
  pageSize: number = PAGE_SIZE
): Promise<Response<Pagination<Product>>> {
  return myAxios.get("/manage/product/list", {
    params: { pageNum, pageSize },
  });
}

export async function reqUpdateProductStatus(
  productId: string,
  status: number
): Promise<Response<string>> {
  return myAxios.post("/manage/product/updateStatus", {
    productId,
    status,
  });
}

export async function reqSearchProducts(
  pageNum: number,
  pageSize: number,
  searchType: string,
  keyword: string
): Promise<Response<Pagination<Product>>> {
  return myAxios.get("/manage/product/search", {
    params: { pageNum, pageSize, [searchType]: keyword },
  });
}

export async function reqDeleteImage(name: string): Promise<Response<{}>> {
  return myAxios.post("/manage/img/delete", {
    name,
  });
}

export async function reqAddProduct(
  params: AddProductParams
): Promise<Response<{}>> {
  return myAxios.post("/manage/product/add", params);
}

export async function reqUpdateProduct(
  params: UpdateProductParams
): Promise<Response<{}>> {
  return myAxios.post("/manage/product/update", params);
}

export async function reqAddRole(roleName: string): Promise<Response<Role>> {
  return myAxios.post("/manage/role/add", { roleName });
}

export async function reqGetRoleList(): Promise<Response<Role[]>> {
  return myAxios.get("/manage/role/list");
}

// |_id          |Y       |string   |角色ID
// |menus        |Y       |array    |权限key数组
// |auth_time    |Y       |number   |权限时间
// |auth_name    |Y       |string   |权限人姓名
export async function reqUpdateRole(
  _id: string,
  menus: string[],
  auth_time: number,
  auth_name: string
): Promise<Response<Role>> {
  return myAxios.post("/manage/role/update", {
    _id,
    menus,
    auth_time,
    auth_name,
  });
}
