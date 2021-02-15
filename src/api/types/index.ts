//服务器返回的状态码
export enum RESPONSE_STATUS {
  SUCCESS = 0,
  FAILED = 1,
}

export interface Response<T> {
  status: number;
  data?: T;
  msg?: string;
}
