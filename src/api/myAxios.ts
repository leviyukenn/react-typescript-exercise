//封装axios，进行自定义配置
import axios from "axios";
import qs from "querystring";
import { message } from "antd";
import { BASE_URL } from "../config/config";

//发送请求时的伪进度条
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const myAxios = axios.create({
  baseURL: BASE_URL,
});

//axios的post请求默认将参数转成json发给服务器
//如果要用urlencoded发，需要借助querystring包将对象转化成x-www-form-urlencoded
//   querystring.stringify({
//       username: username,
//       password: password,
//     })

//配置请求拦截器,实现用urlencoded发送post请求
myAxios.interceptors.request.use((config) => {
  NProgress.start();
  const { method, data } = config;
  //如果为post请求时
  if (method?.toLowerCase() === "post") {
    //如果请求体为一个object,即以json形式请求时，转化成urlencoded
    if (data instanceof Object) {
      config.data = qs.stringify(data);
    }
  }
  return config;
});

//配置响应拦截器
myAxios.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response.data;
  },
  (error) => {
    NProgress.done();
    //统一拦截各种网络错误
    message.error(error.message, 3);
    //中止Promise
    return new Promise(() => {});
  }
);

export default myAxios;
