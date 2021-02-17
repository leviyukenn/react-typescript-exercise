import { useCallback, useState } from "react";

import {
  reqAddCategory,
  reqCategoryList,
  reqUpdateCategory,
} from "../../../../../api/requests";

import { RESPONSE_STATUS } from "../../../../../api/types";
import { Category } from "../../../../../model/category";

export function useCategoryList() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [isPending, setPending] = useState(false);

  //加载分类列表
  const loadCategoryList = useCallback(async () => {
    setPending(true);
    const response = await reqCategoryList();
    if (response.status === RESPONSE_STATUS.SUCCESS) {
      setCategoryList(response.data!.reverse());
      setPending(false);
    } else {
      setPending(false);
      throw new Error(response.msg);
    }
  }, []);

  //添加分类
  const addCategory = useCallback(
    async (categoryName: string, parentId: string = "0") => {
      setPending(true);
      const res = await reqAddCategory(categoryName, parentId);
      if (res.status === RESPONSE_STATUS.SUCCESS) {
        setCategoryList((preState) => [res.data!, ...preState]);
        setPending(false);
      } else {
        setPending(false);
        throw new Error(res.msg);
      }
    },
    []
  );

  //修改分类
  const updateCategory = useCallback(
    async (categoryId: string, categoryName: string) => {
      setPending(true);
      const res = await reqUpdateCategory(categoryId, categoryName);
      if (res.status === RESPONSE_STATUS.SUCCESS) {
        setCategoryList((preState) =>
          preState.map((category) => {
            if (category._id === categoryId) {
              category.name = categoryName;
            }
            return category;
          })
        );
        setPending(false);
      } else {
        setPending(false);
        throw new Error(res.msg);
      }
    },
    []
  );

  return {
    categoryList,
    isPending,
    loadCategoryList,
    addCategory,
    updateCategory,
  };
}
