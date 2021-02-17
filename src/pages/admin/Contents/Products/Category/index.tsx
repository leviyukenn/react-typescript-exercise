import { Card, message, Table, Modal, Form, Input, Button } from "antd";

import { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";

import { PlusCircleOutlined } from "@ant-design/icons";

import { MESSAGE_DURATION, PAGE_SIZE } from "../../../../../config/config";

import { Category } from "../../../../../model/category";
import { useDispatch } from "react-redux";
import { saveCategoryList } from "../../../../../redux/actions/category";
import { useCategoryList } from "./hook";

enum OPERATION_TYPE {
  ADD = "添加分类",
  UPDATE = "修改分类",
}

// type mapResponseToState = (preState:)

export default function CategoryComponent() {
  const {
    categoryList,
    isPending,
    loadCategoryList,
    addCategory,
    updateCategory,
  } = useCategoryList();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalInitialKey, setModalInitalKey] = useState("");
  const [operationType, setOperationType] = useState<OPERATION_TYPE>(
    OPERATION_TYPE.ADD
  );
  const [form] = Form.useForm();

  //初次加载CategoryList
  useEffect(() => {
    loadCategoryList().catch((err: Error) =>
      message.warning(err.message, MESSAGE_DURATION)
    );
  }, []);

  //将categoryList同步到redux
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(saveCategoryList(categoryList));
  }, [categoryList]);

  const showUpdateCategoryModal = useCallback(
    (key: string, categoryName: string) => {
      return () => {
        setModalInitalKey(key);
        form.setFieldsValue({ categoryName });
        setOperationType(OPERATION_TYPE.UPDATE);
        setIsModalVisible(true);
      };
    },
    [form]
  );

  const showAddCategoryModal = useCallback(() => {
    form.resetFields();
    setOperationType(OPERATION_TYPE.ADD);
    setIsModalVisible(true);
  }, [form]);

  const handleOk = async () => {
    //验证表单
    try {
      const value: { categoryName: string } = await form.validateFields();
      switch (operationType) {
        case OPERATION_TYPE.ADD:
          await addCategory(value.categoryName);
          message.success("添加分类成功", MESSAGE_DURATION);
          break;
        case OPERATION_TYPE.UPDATE:
          await updateCategory(modalInitialKey, value.categoryName);
          message.success("修改分类成功", MESSAGE_DURATION);
          break;
        default:
          break;
      }

      //清空表单
      form.resetFields();
      //     //关闭Modal
      setIsModalVisible(false);
    } catch (err) {
      message.warning(err.message, MESSAGE_DURATION);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnsType<Category> = [
    { key: "name", dataIndex: "name", title: "分类名" },
    {
      key: "operation",
      title: "操作",
      dataIndex: "_id",
      render: (_, { _id, name }) => {
        return (
          <Button onClick={showUpdateCategoryModal(_id, name)}>修改分类</Button>
        );
      },
      width: "25%",
      align: "center",
    },
  ];

  return (
    <Card
      title="分类列表"
      extra={
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          size="large"
          onClick={showAddCategoryModal}
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
        pagination={{
          pageSize: PAGE_SIZE,
          showQuickJumper: true,
          showSizeChanger: false,
        }}
        loading={isPending}
        rowKey="_id"
      />
      <Modal
        title={operationType}
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
