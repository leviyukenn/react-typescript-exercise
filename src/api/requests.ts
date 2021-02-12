import { PAGE_SIZE } from "../config/config";
import myAxios from "./myAxios";
import { Category, ProductsPerPage, Response } from "./types";

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
): Promise<Response<ProductsPerPage>> {
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
