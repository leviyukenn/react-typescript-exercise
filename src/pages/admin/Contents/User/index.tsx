import { Button, Card, Table, message, Modal, Input, Select } from "antd";
import Form from "antd/lib/form";
import { ColumnsType } from "antd/lib/table";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { MESSAGE_DURATION, PAGE_SIZE } from "../../../../config/config";
import { User } from "../../../../model/user";
import { useUserList } from "./hook";

import { PlusCircleOutlined } from "@ant-design/icons";

import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const { Option } = Select;

enum OPERATION_TYPE {
  ADD_USER = "添加用户",
  UPDATE_USER = "修改用户",
}

export default function UserComponent() {
  const {
    userList,
    roleList,
    isPending,
    loadUserList,
    addUser,
    updateUser,
    deleteUser,
  } = useUserList();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState("");
  const [operationType, setOperationType] = useState<OPERATION_TYPE>(
    OPERATION_TYPE.ADD_USER
  );

  const [form] = Form.useForm<{
    userName: string;
    password?: string;
    phone: string;
    email: string;
    role_id: string;
  }>();

  //初次加载UserList
  useEffect(() => {
    loadUserList();
  }, []);

  const showAddUserModal = useCallback(() => {
    form.resetFields();
    setOperationType(OPERATION_TYPE.ADD_USER);
    setIsModalVisible(true);
  }, [form]);

  const showUpdateUserModal = useCallback(
    (userId: string) => () => {
      form.resetFields();

      setOperationType(OPERATION_TYPE.UPDATE_USER);
      setUserId(userId);
      const user = userList.find((user) => user._id === userId)!;

      form.setFieldsValue({
        userName: user.username,
        phone: user.phone,
        email: user.email,
        role_id: user.role_id,
      });
      setIsModalVisible(true);
    },
    [form, userList]
  );

  const handleOk = useCallback(async () => {
    //验证表单

    try {
      const value = await form.validateFields();
      switch (operationType) {
        case OPERATION_TYPE.ADD_USER:
          await addUser(
            value.userName,
            value.password!,
            value.phone,
            value.email,
            value.role_id
          );
          message.success("添加分类成功", MESSAGE_DURATION);
          break;
        case OPERATION_TYPE.UPDATE_USER:
          await updateUser(
            userId,
            value.userName,
            value.phone,
            value.email,
            value.role_id
          );
          message.success("修改分类成功", MESSAGE_DURATION);
          break;
        default:
          break;
      }
    } catch (err) {
      message.warning(err, MESSAGE_DURATION);
    } finally {
      //清空表单
      form.resetFields();
      //关闭Modal
      setIsModalVisible(false);
    }
  }, [userId, operationType, form]);

  const handleCancel = () => {
    //清空表单
    form.resetFields();
    setIsModalVisible(false);
  };

  const columns: ColumnsType<User> = [
    { key: "username", dataIndex: "username", title: "用户名称", width: "20%" },
    {
      key: "password",
      dataIndex: "password",
      title: "密码",
      width: "20%",
    },
    {
      key: "phone",
      dataIndex: "phone",
      title: "电话号码",
      width: "20%",
    },
    { key: "email", dataIndex: "email", title: "邮箱", width: "20%" },
    {
      key: "operation",
      title: "操作",
      dataIndex: "_id",
      render: (userId: string) => {
        return (
          <Fragment>
            <Button type="link" onClick={showUpdateUserModal(userId)}>
              修改用户
            </Button>
            <br />
            <Button type="link">删除用户</Button>
          </Fragment>
        );
      },
      width: "20%",
      align: "center",
    },
  ];

  return (
    <Card
      title="用户列表"
      extra={
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          size="large"
          onClick={showAddUserModal}
        >
          添加用户
        </Button>
      }
      style={{ width: "100%", height: "90%" }}
    >
      <Table<User>
        columns={columns}
        dataSource={userList}
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
        <Form name="addUser" form={form}>
          <Form.Item
            label="用户名"
            name="userName"
            // 声明式校验
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="用户名" />
          </Form.Item>
          {operationType === OPERATION_TYPE.ADD_USER ? (
            <Form.Item
              label="密码"
              name="menus"
              // 声明式校验
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password
                placeholder="密码"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          ) : null}
          <Form.Item
            label="电话号码"
            name="phone"
            // 声明式校验
            rules={[{ required: true, message: "请输入电话号码" }]}
          >
            <Input placeholder="电话号码" />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            // 声明式校验
            rules={[{ required: true, message: "请输入邮箱" }]}
          >
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role_id"
            rules={[{ required: true, message: "请选择角色" }]}
          >
            <Select placeholder="角色">
              {roleList.map((role) => {
                return (
                  <Option key={role._id} value={role._id}>
                    {role.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
