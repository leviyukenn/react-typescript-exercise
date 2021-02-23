import { useState, useEffect, useCallback, useMemo } from "react";

import { message } from "antd";

import { RESPONSE_STATUS, Response } from "../../../../../api/types";

import {
  reqProductsPerPage,
  reqSearchProducts,
  reqUpdateProductStatus,
} from "../../../../../api/requests";
import { MESSAGE_DURATION, PAGE_SIZE } from "../../../../../config/config";
import { Product } from "../../../../../model/product";
import { Pagination } from "../../../../../model/pagination";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/reducers";
import { useCategoryList } from "../Category/hook";
import { saveCategoryList } from "../../../../../redux/actions/category";
import { useHistory, useParams } from "react-router-dom";

export function useProductList() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isPending, setPending] = useState(false);
  const [lodings, setLodings] = useState<boolean[]>(
    new Array(productList.length).fill(false, 0)
  );
  const [pagination, setPagination] = useState<Pagination<undefined>>({
    pageNum: 1,
    total: 1,
    pages: 1,
    pageSize: PAGE_SIZE,
  });
  const [searchType, setSearchType] = useState<string>("productName");
  const [keyword, setKeyword] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  //加载商品列表
  const loadProductList = useCallback(
    async (pageNum: number = 1, pageSize: number = PAGE_SIZE) => {
      setPending(true);
      let response: Response<Pagination<Product>>;
      if (isSearching) {
        response = await reqSearchProducts(
          pageNum,
          pageSize,
          searchType,
          keyword
        );
      } else {
        response = await reqProductsPerPage(pageNum, pageSize);
      }
      if (response.status === RESPONSE_STATUS.SUCCESS) {
        const { pageNum, total, pages, pageSize, list } = response.data!;
        setPagination({ pageNum, total, pages, pageSize });
        setProductList(list!);

        setPending(false);
      } else {
        setPending(false);
        message.warning("改变商品状态失败", MESSAGE_DURATION);
      }
    },
    [isSearching, keyword, searchType]
  );

  //商品上下架处理
  const updateProductStatus = useCallback(
    (productId: string, status: number, index: number) => async () => {
      let newLodings = [...lodings];
      newLodings[index] = true;
      setLodings(newLodings);
      const res = await reqUpdateProductStatus(productId, status);
      if (res.status === RESPONSE_STATUS.SUCCESS) {
        setProductList((preState) =>
          preState.map((product) => {
            if (product._id === productId) {
              product.status = status;
            }
            return product;
          })
        );
        newLodings = [...newLodings];
        newLodings[index] = false;
        setLodings(newLodings);
      } else {
        newLodings = [...newLodings];
        newLodings[index] = false;
        setLodings(newLodings);
        throw new Error(res.msg);
      }
    },
    [lodings]
  );

  //将搜索栏维护为受控组件
  const onSearchTypeChange = useCallback((value) => {
    setSearchType(value);
  }, []);
  const onKeywordChange = useCallback((event) => {
    setKeyword(event.target.value);
  }, []);

  //search按钮回调
  const search = useCallback(() => {
    setIsSearching(true);

    loadProductList();
  }, [loadProductList]);

  //切换页时的回调
  const onPageChange = useCallback(
    (pageNum: number, pageSize: number = PAGE_SIZE) => {
      loadProductList(pageNum, pageSize).catch((err: Error) =>
        message.warning(err.message, MESSAGE_DURATION)
      );
    },
    [loadProductList]
  );

  useEffect(() => {
    loadProductList().catch((err: Error) =>
      message.warning(err.message, MESSAGE_DURATION)
    );
  }, []);

  return {
    productList,
    isPending,
    lodings,
    pagination,
    onPageChange,
    updateProductStatus,
    searchType,
    onSearchTypeChange,
    keyword,
    onKeywordChange,
    search,
  };
}

//读取商品类名
//redux中有则从redux中取
//redux中没有则发送网络请求拉取
export function useCategoryState() {
  const categoryState = useSelector((state: RootState) => state.categoryState);
  const dispatch = useDispatch();
  const { categoryList, isPending, loadCategoryList } = useCategoryList();

  useEffect(() => {
    if (categoryState.list.length === 0) {
      if (categoryList.length === 0) {
        loadCategoryList().catch((err: Error) =>
          message.warning(err.message, MESSAGE_DURATION)
        );
      } else {
        dispatch(saveCategoryList(categoryList));
      }
    }
  }, [categoryState, categoryList]);
  return { categoryState, isPending };
}

//回退按钮
export function useGoBack() {
  const history = useHistory();
  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);
  return goBack;
}

//获取params中指定了商品id的商品信息

export function useProduct() {
  const { productId } = useParams<{ productId: string }>();
  const productList = useSelector(
    (state: RootState) => state.productsState.list
  );
  const product = useMemo(
    () => productList.find((product) => product._id === productId),
    [productList]
  );
  return product;
}
