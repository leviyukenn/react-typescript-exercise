import { Card, message, Table, Modal, Form, Input } from "antd";
import Button from "antd/es/button";
import { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";

import { PlusCircleOutlined } from "@ant-design/icons";
import {
  reqAddCategory,
  reqCategoryList,
  CategoryResponse,
  reqUpdateCategory,
} from "../../../../../api/requests";
import {
  MESSAGE_DURATION,
  PAGE_SIZE,
  RESPONSE_STATUS,
} from "../../../../../config/config";

interface Category {
  key: string;
  name: string;
}
enum OPERATION_TYPE {
  ADD = "添加分类",
  UPDATE = "修改分类",
}

function useCategoryList() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [isPending, setPending] = useState(false);

  const mapResponseToCategory = useCallback(
    (item: CategoryResponse): Category => ({
      key: item._id,
      name: item.name,
    }),
    []
  );

  //加载分类列表
  const load = useCallback(async () => {
    setPending(true);
    const response = await reqCategoryList();
    if (response.status === RESPONSE_STATUS.SUCCESS) {
      const list = response.data!.map(mapResponseToCategory);
      setCategoryList(list.reverse());
      setPending(false);
    } else {
      setPending(false);
      throw new Error(response.msg);
    }
  }, [mapResponseToCategory]);

  //添加分类
  const addCategory = useCallback(
    async (categoryName: string, parentId: string = "0") => {
      setPending(true);
      const res = await reqAddCategory(categoryName, parentId);
      if (res.status === RESPONSE_STATUS.SUCCESS) {
        setCategoryList((preState) => [
          mapResponseToCategory(res.data!),
          ...preState,
        ]);
        setPending(false);
      } else {
        setPending(false);
        throw new Error(res.msg);
      }
    },
    [mapResponseToCategory]
  );

  //修改分类
  const updateCategory = useCallback(
    async (categoryId: string, categoryName: string) => {
      setPending(true);
      const res = await reqUpdateCategory(categoryId, categoryName);
      if (res.status === RESPONSE_STATUS.SUCCESS) {
        setCategoryList((preState) =>
          preState.map((category) => {
            if (category.key === categoryId) {
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

  useEffect(() => {
    load().catch((err: Error) =>
      message.warning(err.message, MESSAGE_DURATION)
    );
  }, [load]);

  return { categoryList, isPending, addCategory, updateCategory };
}

export default function CategoryComponent() {
  const {
    categoryList,
    isPending,
    addCategory,
    updateCategory,
  } = useCategoryList();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalInitialKey, setModalInitalKey] = useState("");
  const [operationType, setOperationType] = useState<OPERATION_TYPE>(
    OPERATION_TYPE.ADD
  );
  const [form] = Form.useForm();

  const showUpdateCategoryModal = useCallback(
    (key: string, categoryName: string) => {
      return () => {
        setModalInitalKey(key);
        form.setFieldsValue({ categoryName });
        setOperationType(OPERATION_TYPE.UPDATE);
        setIsModalVisible(true);
      };
    },
    []
  );

  const showAddCategoryModal = useCallback(() => {
    form.resetFields();
    setOperationType(OPERATION_TYPE.ADD);
    setIsModalVisible(true);
  }, []);

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
      dataIndex: "key",
      render: (_, { key, name }) => {
        return (
          <Button onClick={showUpdateCategoryModal(key, name)}>修改分类</Button>
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
