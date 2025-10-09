import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Input, message, Space, Card } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import "./css/common.css"
import "./css/adminPage.css";
import "antd/dist/reset.css";

const { Header, Content, Sider } = Layout;

function AdminPage() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(false);

  // int data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // API ：
      } catch (error) {
        message.error("Failed to load data. Please check API connection");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // book management
  const handleAddBook = () => {
    // bookApi.addBook()
    message.info("Add book");
  };

  const handleEditBook = (record) => {
    // bookApi.updateBook()
    message.info(`Edit book: ${record.title}`);
  };

  const handleDeleteBook = (record) => {
    // bookApi.deleteBook()
    message.warning(`Delete book:${record.title}`);
  };

  // user management
  const handleAddToBlacklist = (user) => {
    // adminApi.addToBlacklist(user.id)
    message.warning(`${user.name} added to blacklist`);
  };

  const handleRemoveFromBlacklist = (user) => {
    // adminApi.removeFromBlacklist(user.id)
    message.success(`${user.name} removed to blacklist`);
  };

  const bookColumns = [
    { title: "Book Name", dataIndex: "title", key: "title" },
    { title: "Author", dataIndex: "author", key: "author" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditBook(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteBook(record)} />
        </Space>
      ),
    },
  ];

  const userColumns = [
    { title: "Username", dataIndex: "name", key: "name" },
    { title: "E-mail", dataIndex: "email", key: "email" },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          type="primary"
          danger
          icon={<UserAddOutlined />}
          onClick={() => handleAddToBlacklist(record)}
        >
          Add to Blacklist
        </Button>
      ),
    },
  ];

  const blackColumns = [
    { title: "Username", dataIndex: "name", key: "name" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    {
      title: "Action",
      render: (_, record) => (
        <Button
          icon={<UserDeleteOutlined />}
          onClick={() => handleRemoveFromBlacklist(record)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Layout className="adminPage-container">
      <Header className="common-header">
        <h1>E-Library Management System Admin Dashboard</h1>
      </Header>

      <Layout>
        <Sider width="60%" className="adminPage-left">
          <Card
            title="Book Management"
            extra={
              <Button
                icon={<PlusOutlined />}
                type="primary"
                className="adminPage-addbtn"
                onClick={handleAddBook}
              >
                Add Book
              </Button>
            }
            bordered={false}
          >
            <Input.Search
              placeholder="Search books by title / author"
              allowClear
              className="adminPage-search"
            />
            <Table
              dataSource={books}
              columns={bookColumns}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              className="adminPage-table"
            />
          </Card>
        </Sider>

        <Content className="adminPage-right">
          <div className="adminPage-righttop">
            <Card title="User Management" bordered={false}>
              <Table
                dataSource={users}
                columns={userColumns}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 4 }}
                className="adminPage-table"
              />
            </Card>
          </div>

          <div className="adminPage-rightbottom">
            <Card title="Blacklist" bordered={false}>
              <Table
                dataSource={blacklist}
                columns={blackColumns}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 4 }}
                className="adminPage-table"
              />
            </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminPage;
