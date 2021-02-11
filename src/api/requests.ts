import myAxios from "./myAxios";

export async function reqLogin(username: string, password: string) {
  return myAxios.post("/login", {
    username: username,
    password: password,
  });
}

export async function reqCategoryList(
  parentId: string = "0"
): Promise<Response<CategoryResponse[]>> {
  return myAxios.get("/manage/category/list", { params: { parentId } });
}

export async function reqAddCategory(
  categoryName: string,
  parentId: string = "0"
): Promise<Response<CategoryResponse>> {
  return myAxios.post("/manage/category/add", {
    parentId: parentId,
    categoryName: categoryName,
  });
}

export async function reqUpdateCategory(
  categoryId: string,
  categoryName: string
): Promise<Response<CategoryResponse>> {
  return myAxios.post("/manage/category/update", {
    categoryId,
    categoryName,
  });
}

interface Response<T> {
  status: number;
  data?: T;
  msg?: string;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  [propName: string]: any;
}
