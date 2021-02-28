import { message } from "antd";
import { useCallback, useState } from "react";
import {
  reqAddRole,
  reqGetRoleList,
  reqUpdateRole,
} from "../../../../api/requests";
import { RESPONSE_STATUS } from "../../../../api/types";
import { MESSAGE_DURATION } from "../../../../config/config";
import { Role } from "../../../../model/role";

export function useRoleList() {
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [isPending, setPending] = useState(false);

  //加载角色列表
  const loadRoleList = useCallback(async () => {
    setPending(true);
    const response = await reqGetRoleList();
    if (response.status === RESPONSE_STATUS.SUCCESS) {
      setRoleList(response.data!.reverse());
      setPending(false);
    } else {
      setPending(false);
      message.warning(response.msg, MESSAGE_DURATION);
    }
  }, []);

  //添加角色
  const addRole = useCallback(async (roleName: string) => {
    setPending(true);
    const response = await reqAddRole(roleName);
    if (response.status === RESPONSE_STATUS.SUCCESS) {
      setRoleList((preState) => [response.data!, ...preState]);
      setPending(false);
    } else {
      setPending(false);
      message.warning(response.msg, MESSAGE_DURATION);
    }
  }, []);

  //修改角色（给角色授权）
  const updateRole = useCallback(
    async (
      _id: string,
      menus: string[],
      auth_time: number,
      auth_name: string
    ) => {
      setPending(true);
      const res = await reqUpdateRole(_id, menus, auth_time, auth_name);
      if (res.status === RESPONSE_STATUS.SUCCESS) {
        setRoleList((preState) =>
          preState.map((role) => {
            if (role._id === _id) {
              role.menus = menus;
              role.auth_name = auth_name;
              role.auth_time = auth_time;
            }
            return role;
          })
        );
        setPending(false);
      } else {
        setPending(false);
        message.warning(res.msg, MESSAGE_DURATION);
      }
    },
    []
  );

  return {
    roleList,
    isPending,
    loadRoleList,
    addRole,
    updateRole,
  };
}
