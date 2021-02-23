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

export interface AddProductParams {
  categoryId: string;
  pCategoryId: string;
  name: string;
  desc: string;
  price: string;
  detail?: string;
  imgs?: string[];
}

// |categoryId    |Y       |string   |分类ID
// |pCategoryId   |Y       |string   |父分类ID
// |name          |Y       |string   |商品名称
// |desc          |N       |string   |商品描述
// |price         |N       |string   |商品价格
// |detail        |N       |string   |商品详情
// |imgs          |N       |array   |商品图片名数组
