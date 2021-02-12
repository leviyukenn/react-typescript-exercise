import React, { useState, useEffect, useCallback } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Card, Table, Input, Button, message, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { Product, RESPONSE_STATUS, Pagination } from "../../../../../api/types";
import {
  reqProductsPerPage,
  reqUpdateProductStatus,
} from "../../../../../api/requests";
import { MESSAGE_DURATION, PAGE_SIZE } from "../../../../../config/config";
import Products from "..";

const { Option } = Select;
const { Search } = Input;

function useProductList() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isPending, setPending] = useState(false);
  const [lodings, setLodings] = useState<boolean[]>(
    new Array(productList.length).fill(false, 0)
  );
  const [pagination, setPagination] = useState<Pagination>({
    pageNum: 1,
    total: 1,
    pages: 1,
    pageSize: PAGE_SIZE,
  });

  //加载商品列表
  const load = useCallback(
    async (pageNum: number = 1, pageSize: number = PAGE_SIZE) => {
      setPending(true);
      const response = await reqProductsPerPage(pageNum, pageSize);
      if (response.status === RESPONSE_STATUS.SUCCESS) {
        const { pageNum, total, pages, pageSize, list } = response.data!;
        setPagination({ pageNum, total, pages, pageSize });
        setProductList(list);
        setPending(false);
      } else {
        setPending(false);
        message.warning("改变商品状态失败", MESSAGE_DURATION);
      }
    },
    []
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
    []
  );

  useEffect(() => {
    load().catch((err: Error) =>
      message.warning(err.message, MESSAGE_DURATION)
    );
  }, [load]);

  return {
    productList,
    isPending,
    lodings,
    pagination,
    load,
    updateProductStatus,
  };
}

export default function ProductComponent() {
  const {
    productList,
    isPending,
    lodings,
    pagination,
    load,
    updateProductStatus,
  } = useProductList();

  const onPageChange = useCallback(
    (page, pageSize) => {
      load(page, pageSize).catch((err: Error) =>
        message.warning(err.message, MESSAGE_DURATION)
      );
    },
    [load]
  );

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
      render: () => {
        return (
          <div>
            <Button type="link">修改</Button>
            <br />
            <Button type="link">详情</Button>
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
          <Select defaultValue="name" style={{ width: 120 }}>
            <Option value="name">按名称搜索</Option>
            <Option value="desc">按描述搜索</Option>
          </Select>
          <Search
            placeholder="输入关键字"
            allowClear
            enterButton="Search"
            style={{ width: 240 }}
          />
        </div>
      }
      extra={
        <Button type="primary" icon={<PlusCircleOutlined />} size="large">
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
