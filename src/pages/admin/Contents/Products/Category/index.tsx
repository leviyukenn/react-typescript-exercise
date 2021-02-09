import { Card, message, Table, Modal, Form, Input } from "antd";
import Button from "antd/es/button";
import { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";

import { PlusCircleOutlined } from "@ant-design/icons";
import { reqAddCategory, reqCategory } from "../../../../../api/requests";
import {
  MESSAGE_DURATION,
  PAGE_SIZE,
  RESPONSE_STATUS,
} from "../../../../../config/config";

function useCategoryList() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [isPending, setPending] = useState(false);
  const load = useCallback(async () => {
    setPending(true);
    const response = await reqCategory();
    if (response.status === RESPONSE_STATUS.SUCCESS) {
      const list: Category[] = response.data.map(mapResponseToCategory);
      setCategoryList(list.reverse());
    } else {
      message.warning("获取分类列表失败", MESSAGE_DURATION);
    }
    setPending(false);
  }, []);

  const mapResponseToCategory = (item: {
    _id: string;
    name: string;
    [propName: string]: any;
  }): Category => ({ key: item._id, name: item.name });

  const addCategory = useCallback(
    async (parentId: string = "0", categoryName: string) => {
      setPending(true);
      const res: {
        data?: any;
        msg?: string;
        status: number;
      } = await reqAddCategory(parentId, categoryName);
      if (res.status === RESPONSE_STATUS.SUCCESS) {
        message.success("添加分类成功", MESSAGE_DURATION);
        setCategoryList((preState) => [
          mapResponseToCategory(res.data),
          ...preState,
        ]);
      } else {
        message.warning(res.msg, MESSAGE_DURATION);
      }
      setPending(false);
    },
    []
  );
  useEffect(() => {
    load();
  }, []);

  return { categoryList, isPending, load, addCategory };
}

export default function CategoryComponent() {
  const { categoryList, isPending, load, addCategory } = useCategoryList();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    //验证表单
    form
      .validateFields()
      .then((values: { categoryName: string }) => {
        //验证通过后，发送请求添加分类名
        return addCategory("0", values.categoryName);
      })
      .then(() => {
        //清空表单
        form.resetFields();
        //关闭Modal
        setIsModalVisible(false);
      })

      .catch((errorInfo) => {});
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Card
      title="分类列表"
      extra={
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          size="large"
          onClick={showModal}
        >
          添加分类
        </Button>
      }
      style={{ width: "100%", height: "90%" }}
    >
      <Table<Category>
        columns={columns}
        dataSource={categoryList}
        bordered
        pagination={{ pageSize: PAGE_SIZE }}
        loading={isPending}
      />
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isPending}
      >
        <Form name="addCategory" form={form}>
          <Form.Item
            name="categoryName"
            // 声明式校验
            rules={[{ required: true, message: "请输入分类名" }]}
          >
            <Input placeholder="分类名" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

interface Category {
  key: string;
  name: string;
}

const columns: ColumnsType<Category> = [
  { key: "name", dataIndex: "name", title: "分类名" },
  {
    key: "operation",
    title: "操作",
    dataIndex: "key",
    render: (text, record, index) => {
      return <Button>点我</Button>;
    },
    width: "25%",
    align: "center",
  },
];
