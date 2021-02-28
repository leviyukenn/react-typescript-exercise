import { Button, Card, Table, message, Modal, Input, TreeSelect } from "antd";
import Form from "antd/lib/form";
import { ColumnsType } from "antd/lib/table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGE_DURATION, PAGE_SIZE } from "../../../../config/config";
import { Role } from "../../../../model/role";
import { useRoleList } from "./hook";
import dayjs from "dayjs";
import { PlusCircleOutlined } from "@ant-design/icons";
import { RouteItem, routeList } from "../../../../config/routeConfig";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/reducers";

enum OPERATION_TYPE {
  ADD_ROLE = "添加角色",
  AUTHORIZATION = "设置权限",
}

interface TreeNode {
  title: string;
  value: string;
  key: string;
  children?: TreeNode[];
}

const { SHOW_PARENT } = TreeSelect;
function renderTreeNode(menuList: RouteItem[]): TreeNode[] {
  const treeNodes: TreeNode[] = [];

  menuList.forEach((item) => {
    if (!item.inNavMenu) return;
    if (!item.children || item.notListChildren) {
      treeNodes.push({ title: item.title, key: item.key, value: item.key });
    } else {
      treeNodes.push({
        title: item.title,
        key: item.key,
        value: item.key,
        children: renderTreeNode(item.children!),
      });
    }
  });
  return treeNodes;
}

export default function RoleComponent() {
  const {
    roleList,
    isPending,
    loadRoleList,
    addRole,
    updateRole,
  } = useRoleList();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [roleId, setRoleId] = useState("");
  const [operationType, setOperationType] = useState<OPERATION_TYPE>(
    OPERATION_TYPE.ADD_ROLE
  );
  const loginState = useSelector((state: RootState) => state.loginState);
  const [form] = Form.useForm<{
    roleName: string;
    menus?: string[];
  }>();
  const treeData = useMemo(() => renderTreeNode(routeList), [routeList]);

  //初次加载RoleList
  useEffect(() => {
    loadRoleList();
  }, []);

  //将roleList同步到redux
  //   const dispatch = useDispatch();
  //   useEffect(() => {
  //     dispatch(saveRoleList(roleList));
  //   }, [roleList]);

  //   const showUpdateRoleModal = useCallback(
  //     (key: string, roleName: string) => {
  //       return () => {
  //         setModalInitalKey(key);
  //         form.setFieldsValue({ roleName });
  //         setOperationType(OPERATION_TYPE.UPDATE);
  //         setIsModalVisible(true);
  //       };
  //     },
  //     [form]
  //   );

  const showAddRoleModal = useCallback(() => {
    form.resetFields();
    setOperationType(OPERATION_TYPE.ADD_ROLE);
    setIsModalVisible(true);
  }, [form]);

  const showAuthorizationModal = useCallback(
    (roleId: string, roleName: string) => () => {
      form.resetFields();

      setOperationType(OPERATION_TYPE.AUTHORIZATION);
      setRoleId(roleId);

      form.setFieldsValue({
        roleName: roleName,
        menus: roleList.find((item) => item._id === roleId)?.menus || [],
      });
      setIsModalVisible(true);
    },
    [form, roleList]
  );

  const handleOk = useCallback(async () => {
    //验证表单

    const value = await form.validateFields();
    switch (operationType) {
      case OPERATION_TYPE.ADD_ROLE:
        await addRole(value.roleName);
        message.success("添加分类成功", MESSAGE_DURATION);
        break;
      case OPERATION_TYPE.AUTHORIZATION:
        await updateRole(
          roleId,
          value.menus!,
          Date.now(),
          loginState.userInfo.username
        );
        message.success("修改分类成功", MESSAGE_DURATION);
        break;
      default:
        break;
    }

    //清空表单
    form.resetFields();
    //关闭Modal
    setIsModalVisible(false);
  }, [roleId, operationType, form]);

  const handleCancel = () => {
    //清空表单
    form.resetFields();
    setIsModalVisible(false);
  };

  const columns: ColumnsType<Role> = [
    { key: "name", dataIndex: "name", title: "角色名称" },
    {
      key: "create_time",
      dataIndex: "create_time",
      title: "创建时间",
      render: (time: number) => dayjs(time).format("YYYY年 MM月DD日 HH:mm:ss"),
    },
    {
      key: "auth_time",
      dataIndex: "auth_time",
      title: "授权时间",
      render: (time?: number) =>
        time ? dayjs(time).format("YYYY年 MM月DD日 HH:mm:ss") : "",
    },
    { key: "auth_name", dataIndex: "auth_name", title: "授权人" },
    {
      key: "operation",
      title: "操作",
      dataIndex: "_id",
      render: (_, { _id, name }) => {
        return (
          <Button type="link" onClick={showAuthorizationModal(_id, name)}>
            设置权限
          </Button>
        );
      },
      width: "20%",
      align: "center",
    },
  ];

  return (
    <Card
      title="角色列表"
      extra={
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          size="large"
          onClick={showAddRoleModal}
        >
          添加分类
        </Button>
      }
      style={{ width: "100%", height: "90%" }}
    >
      <Table<Role>
        columns={columns}
        dataSource={roleList}
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
        <Form name="addRole" form={form}>
          <Form.Item
            name="roleName"
            // 声明式校验
            rules={[{ required: true, message: "请输入角色名" }]}
          >
            <Input
              placeholder="角色名"
              disabled={operationType === OPERATION_TYPE.AUTHORIZATION}
            />
          </Form.Item>
          {operationType === OPERATION_TYPE.AUTHORIZATION ? (
            <Form.Item
              name="menus"
              // 声明式校验
              rules={[{ required: true, message: "请选择权限" }]}
            >
              <TreeSelect
                {...{
                  treeData,
                  treeDefaultExpandAll: true,
                  treeCheckable: true,
                  showCheckedStrategy: "SHOW_PARENT",
                  placeholder: "Please select",
                  style: {
                    width: "100%",
                  },
                }}
              />
            </Form.Item>
          ) : null}
        </Form>
      </Modal>
    </Card>
  );
}
