import myAxios from "./myAxios";

export async function reqLogin(username: string, password: string) {
  return myAxios.post("/login", {
    username: username,
    password: password,
  });
}

export async function reqCategory() {
  return myAxios.get("/manage/category/list", { params: { parentId: "0" } });
}

export async function reqAddCategory(parentId: string, categoryName: string) {
  return myAxios.post("/manage/category/add", {
    parentId: parentId,
    categoryName: categoryName,
  });
}
