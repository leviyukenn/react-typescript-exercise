import { Button, List, Typography } from "antd";
import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useCategoryState, useGoBack, useProduct } from "../../Product/hook";
import { BASE_URL } from "../../../../../../config/config";

export default function ProductDetail() {
  const goBack = useGoBack();
  const { categoryState, isPending } = useCategoryState();
  const product = useProduct();

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
      loading={isPending}
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
        {product?.imgs.map((img) => {
          return (
            <img key={img} src={`${BASE_URL}/upload/${img}`} alt="商品图片" />
          );
        })}
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
