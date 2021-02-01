import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { loginRequest } from "../../../../api/login";

type TFormData = {
  username: string;
  password: string;
};

const LoginForm = () => {
  const onFinish = async (values: TFormData) => {
    //底层用Promise链式调用，只有在validator的Promise不被reject时才会调用该回调
    let res = await loginRequest(values.username, values.password);
    if (res.status === 1) {
      message.warning("用户名密码出错", 3);
     
    }
  };

  async function pwdValidator(_: any, value: string): Promise<string> {
    if (!value) {
      return Promise.reject("密码必须输入");
    } else if (value.length < 4) {
      return Promise.reject("密码必须大于等于4位");
    } else if (value.length > 12) {
      return Promise.reject("密码必须小于等于12位");
    } else if (!/^\w+$/.test(value)) {
      return Promise.reject("密码必须由数字，字母，下划线组成");
    } else {
      return Promise.resolve("密码合法");
    }
  }

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        // 声明式校验
        rules={[
          { required: true, message: "请输入用户名" },
          { min: 4, message: "用户名必须大于4位" },
          { max: 12, message: "用户名必须小于12位" },
          { pattern: /^\w+$/, message: "用户名必须由数字，字母，下划线组成" },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Username"
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ validator: pwdValidator }]}>
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <a href="">register now!</a>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
