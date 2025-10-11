import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Form, Input, Button, Select, message, Modal, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { studentLogin } from "./api/studentApi";
import { adminLogin } from "./api/adminApi";
import "./css/common.css";
import "./css/loginPage.css";
import "antd/dist/reset.css";

const { Option } = Select;

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ React 19 兼容的 Modal 弹窗函数
  const showReact19Modal = (title, content) => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    root.render(
      <Modal
        open={true}
        title={title}
        centered
        okText="OK"
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={() => {
          root.unmount();
          div.remove();
        }}
        onCancel={() => {
          root.unmount();
          div.remove();
        }}
      >
        <p>{content}</p>
      </Modal>
    );
  };

  // ✅ 登录逻辑
  const handleLogin = async (values) => {
    const { username, password, role } = values;
    if (!username || !password || !role) {
      message.warning("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      let res;

      if (role === "student") {
        res = await studentLogin({ username, password });
      } else if (role === "admin") {
        res = await adminLogin({ username, password });
      }

      // ✅ 登录成功
      if (res?.data?.id || res?.data?.username) {
        localStorage.setItem("user", JSON.stringify(res.data));
        message.success(`Welcome back, ${res.data.username}!`);

        if (role === "student") {
          navigate("/studentPage");
        } else {
          navigate("/adminPage");
        }
        return;
      }

      // 登录失败提示
      if (res?.error) {
        message.error(res.error);
      } else {
        message.error("Login failed, please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);

      // ✅ 黑名单用户（Lambda 返回 403）
      if (err.response?.status === 403) {
        let reason =
          "Your account has been blacklisted. Login is restricted.";
        try {
          const raw = err.response?.data;
          if (typeof raw === "string") {
            const parsed = JSON.parse(raw);
            reason = parsed?.error || parsed?.reason || reason;
          } else if (raw?.error) {
            reason = raw.error;
          }
        } catch (e) {
          console.warn("Error parsing blacklist message:", e);
        }

        showReact19Modal("Login Restricted", reason);
      }

      // ✅ 普通密码错误
      else if (err.response?.status === 401) {
        message.error("Invalid username or password.");
      }

      // ✅ 其他错误
      else {
        message.error("Login failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <Card
        className="login-card"
        title={<h2 style={{ textAlign: "center" }}>E-Library Login</h2>}
      >
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select your role!" }]}
          >
            <Select placeholder="Select your role">
              <Option value="student">Student</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ marginTop: 10 }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default LoginPage;
