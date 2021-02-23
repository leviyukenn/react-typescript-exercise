import { Button, Card, Form, Input, InputNumber, message, Select } from "antd";
import React, { useCallback, useRef, useState } from "react";
import { useCategoryState, useGoBack } from "../hook";
import { ArrowLeftOutlined } from "@ant-design/icons";
import PicturesWall from "./PicturesWall";
import RichTextEditor from "./RichTextEditor";
import { MESSAGE_DURATION } from "../../../../../../config/config";
import { reqAddProduct } from "../../../../../../api/requests";
import { RESPONSE_STATUS } from "../../../../../../api/types";

const { Option } = Select;

// |categoryId    |Y       |string   |分类ID
// |pCategoryId   |Y       |string   |父分类ID
// |name          |Y       |string   |商品名称
// |desc          |N       |string   |商品描述
// |price         |N       |string   |商品价格
// |detail        |N       |string   |商品详情
// |imgs          |N       |array   |商品图片名数组

type FormData = {
  name: string;
  desc: string;
  price: string;
  categoryId: string;
};

export default function AddUpdateProduct() {
  const goBack = useGoBack();
  const [form] = Form.useForm();
  const { categoryState, isPending } = useCategoryState();
  const [imgNames, setImgNames] = useState<string[]>([]);
  const [productDetail, setProductDetail] = useState<string>("");

  const handleSubmit = useCallback(async () => {
    //验证表单
    try {
      const value: FormData = await form.validateFields();

      const pCategoryId = categoryState.list.find(
        (category) => category._id === value.categoryId
      )!.parentId;

      const res = await reqAddProduct({
        ...value,
        pCategoryId,
        detail: productDetail,
        imgs: imgNames,
      });

      if (res.status === RESPONSE_STATUS.SUCCESS) {
        message.success("添加商品成功", MESSAGE_DURATION);
      }
      if (res.status === RESPONSE_STATUS.FAILED)
        throw new Error("添加商品失败");

      // switch (operationType) {
      //   case OPERATION_TYPE.ADD:
      //     await addCategory(value.categoryName);
      //     message.success("添加分类成功", MESSAGE_DURATION);
      //     break;
      //   case OPERATION_TYPE.UPDATE:
      //     await updateCategory(modalInitialKey, value.categoryName);
      //     message.success("修改分类成功", MESSAGE_DURATION);
      //     break;
      //   default:
      //     break;
      // }

      //清空表单
      form.resetFields();
    } catch (err) {
      message.warning(err.message, MESSAGE_DURATION);
    }
  }, [imgNames, productDetail]);

  return (
    <Card
      title={
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
      style={{ width: "100%", minHeight: 600 }}
    >
      <Form form={form}>
        <Form.Item
          label="商品名称"
          name="name"
          rules={[{ required: true, message: "请输入商品名称" }]}
          labelCol={{ span: 2, offset: 1 }}
          wrapperCol={{ span: 7 }}
        >
          <Input placeholder="商品名称" />
        </Form.Item>
        <Form.Item
          label="商品描述"
          name="desc"
          rules={[{ required: true, message: "请输入商品描述" }]}
          labelCol={{ span: 2, offset: 1 }}
          wrapperCol={{ span: 7 }}
        >
          <Input placeholder="商品描述" />
        </Form.Item>
        <Form.Item
          label="商品价格"
          name="price"
          rules={[{ required: true, message: "商品价格" }]}
          labelCol={{ span: 2, offset: 1 }}
          wrapperCol={{ span: 7 }}
        >
          <Input
            prefix="￥"
            suffix="RMB"
            type="number"
            placeholder="请输入商品价格"
          />
        </Form.Item>
        <Form.Item
          label="商品分类"
          name="categoryId"
          rules={[{ required: true, message: "商品分类" }]}
          labelCol={{ span: 2, offset: 1 }}
          wrapperCol={{ span: 7 }}
        >
          <Select
            style={{ width: 120 }}
            loading={isPending}
            placeholder="请选择分类"
          >
            {categoryState.list.map((category) => {
              return (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="商品图片"
          name="images"
          labelCol={{ span: 2, offset: 1 }}
          wrapperCol={{ span: 9 }}
        >
          <PicturesWall setImgNames={setImgNames} />
        </Form.Item>
        <Form.Item
          label="商品详情"
          name="detail"
          labelCol={{ span: 2, offset: 1 }}
          wrapperCol={{ span: 15 }}
        >
          <RichTextEditor setProductDetail={setProductDetail} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 3 }}>
          <Button type="primary" htmlType="button" onClick={handleSubmit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
