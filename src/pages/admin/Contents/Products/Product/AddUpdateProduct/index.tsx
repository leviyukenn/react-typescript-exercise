import { Button, Card, Form, Input, message, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useCategoryState, useGoBack, useProduct } from "../hook";
import { UploadFile } from "antd/lib/upload/interface";
import { ArrowLeftOutlined } from "@ant-design/icons";
import PicturesWall from "./PicturesWall";
import RichTextEditor from "./RichTextEditor";
import { BASE_URL, MESSAGE_DURATION } from "../../../../../../config/config";
import {
  reqAddProduct,
  reqUpdateCategory,
  reqUpdateProduct,
} from "../../../../../../api/requests";
import { RESPONSE_STATUS, Response } from "../../../../../../api/types";
import { Image } from "../../../../../../model/image";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

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
  const [form] = Form.useForm<FormData>();
  const { categoryState, isPending } = useCategoryState();

  const [fileList, setFileList] = useState<UploadFile<Response<Image>>[]>([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const product = useProduct();

  const [isUpdate, setIsUpdate] = useState(false);

  //如果product不为undefined说明进入修改商品界面
  useEffect(() => {
    if (product) {
      setIsUpdate(true);
      form.setFieldsValue({
        name: product.name,
        desc: product.desc,
        price: product.price + "",
        categoryId: product.categoryId,
      });
      setFileList(
        product.imgs.map((imgName, index) => ({
          uid: -index + "",
          size: 0,
          name: imgName,
          url: `${BASE_URL}/upload/${imgName}`,
          type: "",
        }))
      );
      const contentBlock = htmlToDraft(product.detail);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
    }
  }, [product, form]);

  const handleSubmit = useCallback(async () => {
    //验证表单
    try {
      const value: FormData = await form.validateFields();

      const pCategoryId =
        categoryState.list.find((category) => category._id === value.categoryId)
          ?.parentId || "0";

      let response: Response<{}>;
      if (!isUpdate) {
        response = await reqAddProduct({
          ...value,
          pCategoryId,
          detail: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          imgs: fileList.map((img) => img.name),
        });
        if (response.status === RESPONSE_STATUS.SUCCESS) {
          message.success("添加商品成功", MESSAGE_DURATION);
        }
        if (response.status === RESPONSE_STATUS.FAILED)
          throw new Error("添加商品失败");
      } else {
        response = await reqUpdateProduct({
          ...value,
          _id: product!._id,
          pCategoryId,
          detail: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          imgs: fileList.map((img) => img.name),
        });
        console.log({
          ...value,
          _id: product!._id,
          pCategoryId,
          detail: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          imgs: fileList.map((img) => img.name),
        });
        if (response.status === RESPONSE_STATUS.SUCCESS) {
          message.success("修改商品成功", MESSAGE_DURATION);
        }
        if (response.status === RESPONSE_STATUS.FAILED)
          throw new Error("修改商品失败");
      }

      //清空表单
      form.resetFields();
      setEditorState(EditorState.createEmpty());
      setFileList([]);
      goBack();
    } catch (err) {
      message.warning(err.message, MESSAGE_DURATION);
    }
  }, [fileList, editorState]);

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
          name="imgs"
          labelCol={{ span: 2, offset: 1 }}
          wrapperCol={{ span: 9 }}
        >
          <PicturesWall {...{ fileList, setFileList }} />
        </Form.Item>
        <Form.Item
          label="商品详情"
          name="detail"
          labelCol={{ span: 2, offset: 1 }}
          wrapperCol={{ span: 15 }}
        >
          <RichTextEditor {...{ editorState, setEditorState }} />
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
