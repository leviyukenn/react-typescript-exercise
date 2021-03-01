import { useCallback, useState } from "react";
import {
  reqAddUser,
  reqGetUserList,
  reqUpdateUser,
  reqDeleteUser,
} from "../../../../api/requests";
import { RESPONSE_STATUS } from "../../../../api/types";
import { Role } from "../../../../model/role";

import { User } from "../../../../model/user";

export function useUserList() {
  const [userList, setUserList] = useState<User[]>([]);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [isPending, setPending] = useState(false);

  //加载用户
  const loadUserList = useCallback(async () => {
    setPending(true);
    const response = await reqGetUserList();
    if (response.status === RESPONSE_STATUS.SUCCESS) {
      setUserList(response.data!.users.reverse());
      setRoleList(response.data!.roles);
      setPending(false);
    } else {
      setPending(false);
      throw new Error(response.msg);
    }
  }, []);

  //添加用户
  const addUser = useCallback(
    async (
      userName: string,
      password: string,
      phone: string,
      email: string,
      role_id: string
    ) => {
      setPending(true);
      const response = await reqAddUser(
        userName,
        password,
        phone,
        email,
        role_id
      );
      if (response.status === RESPONSE_STATUS.SUCCESS) {
        setUserList((preState) => [response.data!, ...preState]);
        setPending(false);
      } else {
        setPending(false);
        throw new Error(response.msg);
      }
    },
    []
  );

  //修改用户信息
  const updateUser = useCallback(
    async (
      _id: string,
      userName: string,
      phone: string,
      email: string,
      role_id: string
    ) => {
      setPending(true);
      const res = await reqUpdateUser(_id, userName, phone, email, role_id);
      if (res.status === RESPONSE_STATUS.SUCCESS) {
        setUserList((preState) =>
          preState.map((user) => {
            if (user._id === _id) {
              user.username = userName;
              user.phone = phone;
              user.email = email;
              user.role_id = role_id;
            }
            return user;
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

  //删除用户信息
  const deleteUser = useCallback(async (userId: string) => {
    setPending(true);
    const res = await reqDeleteUser(userId);
    if (res.status === RESPONSE_STATUS.SUCCESS) {
      setUserList((preState) => preState.filter((user) => user._id !== userId));
      setPending(false);
    } else {
      setPending(false);
      throw new Error(res.msg);
    }
  }, []);

  return {
    userList,
    roleList,
    isPending,
    loadUserList,
    addUser,
    updateUser,
    deleteUser,
  };
}
