import React, { useState } from "react";
import { Layout, Form, Input, Button, Select, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { loginUser } from "./api/studentApi";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import "./css/loginPage.css";

const { Content } = Layout;
const { Option } = Select;

function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const { username, password } = values;

    if (!username || !password) {
      message.warning("Please enter both username and password.");
      return;
    }

    setErrorText("");
    setLoading(true);

    try {
      const res = await loginUser(username, password, role);
      const msg = typeof res.message === "string" ? res.message.toLowerCase() : "";
      const success = msg.includes("success");

      if (success) {
        const userData = res.data;
        if (userData?.status === "blacklisted") {
          setErrorText("Access denied: You are blacklisted for repeated overdue returns.");
          setLoading(false);
          return;
        }

        localStorage.setItem("user", JSON.stringify(userData));
        message.success("Login successful!");
        navigate(role === "student" ? "/studentPage" : "/adminPage");
      } else {
        setErrorText(res?.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 401) {
        setErrorText("Unauthorized: Incorrect username, password, or role.");
      } else {
        setErrorText("Unable to connect to the server. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="loginPage-container">
      <Content className="loginPage-content">
        <div className="loginPage-glass">
          <h1 className="loginPage-title">E-Library Management System login</h1>
          <p className="loginPage-subtitle">Access your digital library with ease.</p>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            className="loginPage-form"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please enter your username" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter username" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Enter password" size="large" />
            </Form.Item>

            <Form.Item label="Select Role">
              <Select
                value={role}
                onChange={setRole}
                size="large"
                className="loginPage-select"
              >
                <Option value="student">Student</Option>
                <Option value="admin">Admin</Option>
              </Select>
            </Form.Item>

            {errorText && <p className="loginPage-error">{errorText}</p>}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="loginPage-button"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}

export default LoginPage;
