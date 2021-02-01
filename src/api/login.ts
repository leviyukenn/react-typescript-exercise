import myAxios from "./myAxios";

export async function loginRequest(username: string, password: string) {
  return myAxios.post("/login", {
    username: username,
    password: password,
  });
}
