import { Button, Card, List, message, Typography } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";
import { RootState } from "../../../../../../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { useCategoryList } from "../../Category/hook";
import { MESSAGE_DURATION } from "../../../../../../config/config";
import { saveCategoryList } from "../../../../../../redux/actions/category";

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const history = useHistory();
  const productList = useSelector(
    (state: RootState) => state.productsState.list
  );
  const product = useMemo(
    () => productList.find((product) => product._id === productId),
    [productList]
  );

  //回退按钮
  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);

  //读取商品类名
  //redux中有则从redux中取
  const categoryState = useSelector((state: RootState) => state.categoryState);
  const dispatch = useDispatch();
  const { categoryList, isPending, loadCategoryList } = useCategoryList();

  useEffect(() => {
    if (categoryState.list.length === 0) {
      loadCategoryList()
        .then(() => dispatch(saveCategoryList(categoryList)))
        .catch((err: Error) => message.warning(err.message, MESSAGE_DURATION));
    }
  }, [categoryState, categoryList]);

  return (
    <List
      header={
        <div
          style={{ display: "flex", alignContent: "center", height: "40px" }}
        >
          <Button
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={goBack}
          />
          &nbsp;&nbsp;&nbsp;
          <h1 style={{ fontSize: "20px" }}>商品详情</h1>
        </div>
      }
      bordered
    >
      <List.Item>
        <Typography.Text strong>商品名称:</Typography.Text> {product?.name}
      </List.Item>
      <List.Item>
        <Typography.Text strong>商品描述:</Typography.Text> {product?.desc}
      </List.Item>
      <List.Item>
        <Typography.Text strong>商品价格:</Typography.Text>
        {"¥" + product?.price}
      </List.Item>
      <List.Item>
        <Typography.Text strong>商品分类:</Typography.Text>
        {
          categoryState.list.find(
            (category) => category._id === product?.categoryId
          )?.name
        }
      </List.Item>
      <List.Item>
        <Typography.Text strong>商品图片:</Typography.Text>
        {/* {product?.imgs.map((img) => {
          return <img src={"/upload" + img} alt="商品图片" />;
        })} */}
        imgs
      </List.Item>
      <List.Item
        style={{ display: "flex", flexFlow: "column", alignItems: "start" }}
      >
        <Typography.Text strong>商品详情:</Typography.Text>
        <div dangerouslySetInnerHTML={{ __html: product?.detail! }}></div>
      </List.Item>
    </List>
  );
}
