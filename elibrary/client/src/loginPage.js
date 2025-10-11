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

  // Compatible Modal for React 19
  const showModal = (title, content) => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);
    const close = () => {
      root.unmount();
      div.remove();
    };

    root.render(
      <Modal
        open
        title={title}
        centered
        okText="OK"
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={close}
        onCancel={close}
      >
        <p>{content}</p>
      </Modal>
    );
  };

  // Handle Login
  const handleLogin = async (values) => {
    const { username, password, role } = values;
    if (!username || !password || !role) {
      message.warning("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const loginFn = role === "student" ? studentLogin : adminLogin;
      const res = await loginFn({ username, password });

      if (res?.data?.username) {
        localStorage.setItem("user", JSON.stringify(res.data));
        message.success(`Welcome back, ${res.data.username}!`);
        navigate(role === "student" ? "/studentPage" : "/adminPage");
        return;
      }

      message.error(res?.error || "Login failed, please try again.");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 403) {
        // Blacklisted users
        const raw = err.response?.data;
        let reason =
          typeof raw === "string"
            ? JSON.parse(raw)?.error || "Your account is restricted."
            : raw?.error || "Your account is restricted.";
        showModal("Login Restricted", reason);
      } else if (err.response?.status === 401) {
        message.error("Invalid username or password.");
      } else {
        message.error("Login failed. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <div className="login-page-container">
      <Card className="login-card" title={<h2>E-Library Login</h2>}>
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
              loading={loading}
              block
              className="login-button"
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
