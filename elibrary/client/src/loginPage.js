import React, { useState } from "react";
import { Layout, Form, Input, Button, Select, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { loginStudent } from "./api/studentApi";
import { loginAdmin } from "./api/adminApi";
import "./css/loginPage.css";
import "antd/dist/reset.css";

const { Content } = Layout;
const { Option } = Select;

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      if (role === "student") {
        await loginStudent(values);
        message.success("Student login successful!");
      } else {
        await loginAdmin(values);
        message.success("Admin login successful!");
      }
    } catch (err) {
      message.error("Login failed. Please check username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="loginPage-container">
      <Content className="loginPage-content">
        <div className="loginPage-box">
          <h2>E-Library Management System Login</h2>

          <Form
            layout="vertical"
            onFinish={handleLogin}
            className="loginPage-form"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please enter the username" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Please enter the username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter the password" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Please enter the password"
                size="large"
              />
            </Form.Item>

            <Form.Item label="Select role.">
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="loginPage-button"
              >
                submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}

export default LoginPage;