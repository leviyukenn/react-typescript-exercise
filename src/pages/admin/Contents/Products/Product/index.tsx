import React, { useCallback, useEffect } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Card, Table, Input, Button, Select } from "antd";
import { ColumnsType } from "antd/es/table";

import { useProductList } from "./hook";

import { Product } from "../../../../../model/product";
import { useDispatch } from "react-redux";
import { saveProducts } from "../../../../../redux/actions/products";
import { Link, useHistory } from "react-router-dom";
const { Option } = Select;
const { Search } = Input;

export default function ProductComponent() {
  const {
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
  } = useProductList();

  //调用react-redux的Hook
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(saveProducts(productList));
  }, [productList]);

  const history = useHistory();
  const toAddProduct = useCallback(() => {
    history.push("/admin/products/product/addProduct");
  }, [history]);

  const columns: ColumnsType<Product> = [
    { key: "name", dataIndex: "name", title: "商品名称", width: "20%" },
    { key: "desc", dataIndex: "desc", title: "商品描述", width: "50%" },
    {
      key: "price",
      dataIndex: "price",
      title: "商品价格",
      render: (price: number) => "¥" + price,
      width: "10%",
      align: "center",
    },
    {
      key: "status",
      dataIndex: "status",
      title: "状态",
      width: "10%",
      align: "center",
      render: (_, { _id, status }, index) => {
        if (status === 1) {
          return (
            <div>
              <Button
                type="primary"
                onClick={updateProductStatus(_id, 2, index)}
                loading={lodings[index]}
              >
                上架
              </Button>
              <br />
              <span>未上线</span>
            </div>
          );
        } else if (status === 2) {
          return (
            <div>
              <Button
                type="primary"
                danger
                onClick={updateProductStatus(_id, 1, index)}
                loading={lodings[index]}
              >
                下架
              </Button>
              <br />
              <span>在售</span>
            </div>
          );
        }
      },
    },

    {
      key: "operation",
      title: "操作",
      dataIndex: "_id",
      render: (_id: string) => {
        return (
          <div>
            <Link to={`/admin/products/product/updateProduct/${_id}`}>
              修改
            </Link>
            <br />
            <Link to={`/admin/products/product/productDetail/${_id}`}>
              详情
            </Link>
          </div>
        );
      },
      width: "10%",
      align: "center",
    },
  ];

  return (
    <Card
      title={
        <div>
          <Select
            value={searchType}
            style={{ width: 120 }}
            onChange={onSearchTypeChange}
          >
            <Option value="productName">按名称搜索</Option>
            <Option value="productDesc">按描述搜索</Option>
          </Select>
          <Search
            placeholder="输入关键字"
            allowClear
            enterButton="Search"
            style={{ width: 240 }}
            onChange={onKeywordChange}
            value={keyword}
            onSearch={search}
          />
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          size="large"
          onClick={toAddProduct}
        >
          添加商品
        </Button>
      }
      style={{ width: "100%", height: "90%" }}
    >
      <Table<Product>
        columns={columns}
        dataSource={productList}
        bordered
        pagination={{
          pageSize: pagination.pageSize,
          current: pagination.pageNum,
          total: pagination.total,
          showQuickJumper: true,
          showSizeChanger: false,
          onChange: onPageChange,
        }}
        loading={isPending}
        rowKey="_id"
      />
    </Card>
  );
}
