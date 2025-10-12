import React, { useEffect, useState } from "react";
import { Layout, Table, Button, Input, Select, Modal, Form, Space, Card, message } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, UserAddOutlined, UserDeleteOutlined, LogoutOutlined } from "@ant-design/icons";
import { getAllBooks, addBook, updateBook, deleteBook } from "./api/bookApi";
import { getAllUsers, getBlacklist, addToBlacklist, removeFromBlacklist } from "./api/adminApi";
import { useNavigate } from "react-router-dom";
import "./css/common.css";
import "./css/adminPage.css";
import "antd/dist/reset.css";

const { Header, Sider, Content } = Layout;
const { Option } = Select;

function AdminPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  // Confirm Dialog
  const showConfirm = async (title, content) => {
    return new Promise((resolve) => {
      modal.confirm({
        title,
        content,
        okText: "Confirm",
        cancelText: "Cancel",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  // Initialization
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      message.warning("Please log in first");
      navigate("/loginPage");
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [bookRes, userRes, blackRes] = await Promise.all([
        getAllBooks(),
        getAllUsers(),
        getBlacklist(),
      ]);
      setBooks(bookRes.data || bookRes || []);
      setUsers(userRes.data || userRes || []);
      setBlacklist(blackRes.data || blackRes || []);
    } catch (err) {
      console.error("Data loading failed:", err);
      message.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // add book
  const handleAddBook = async () => {
    try {
      const values = await form.validateFields();
      await addBook(values);
      message.success("Book added successfully");
      setIsAddModalVisible(false);
      fetchAllData();
    } catch (err) {
      console.error(err);
      message.error("Failed to add book");
    }
  };

  // edit book
  const handleUpdateBook = async () => {
    try {
      const values = await editForm.validateFields();
      const confirmed = await showConfirm(
        "Confirm Edit",
        "Are you sure you want to update this book?"
      );
      if (!confirmed) return;
      await updateBook(editingBook.id, values);
      message.success("Book updated successfully");
      setIsEditModalVisible(false);
      fetchAllData();
    } catch (err) {
      console.error("Update error:", err);
      message.error("Failed to update book");
    }
  };

  // -delete book
  const handleDeleteBook = async (record) => {
    const confirmed = await showConfirm(
      "Confirm Delete",
      `Delete "${record.title}"?`
    );
    if (!confirmed) return;
    try {
      await deleteBook(record.id);
      message.success("Book deleted successfully");
      fetchAllData();
    } catch (err) {
      console.error("Delete error:", err);
      message.error("Failed to delete book");
    }
  };

  // add to Blacklist
  const handleAddToBlacklist = async (user) => {
    const confirmed = await showConfirm(
      "Add to Blacklist",
      `Add ${user.username} to blacklist?`
    );
    if (!confirmed) return;
    try {
      await addToBlacklist({ user_id: user.id, reason: "Violation of rules" });
      message.success(`${user.username} added to blacklist`);
      fetchAllData();
    } catch (err) {
      console.error("Add blacklist error:", err);
      message.error("Failed to add user");
    }
  };

  // Remove from Blacklist
  const handleRemoveFromBlacklist = async (user) => {
    const confirmed = await showConfirm(
      "Remove from Blacklist",
      `Remove ${user.username} from blacklist?`
    );
    if (!confirmed) return;
    try {
      await removeFromBlacklist(user.id);
      message.success(`${user.username} removed from blacklist`);
      fetchAllData();
    } catch (err) {
      console.error("Remove blacklist error:", err);
      message.error("Failed to remove user");
    }
  };

  // Logout 
  const handleLogout = () => {
    localStorage.removeItem("user");
    message.info("Logged out");
    navigate("/");
  };

  // Search Filter
  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(b.category);
    return matchSearch && matchCategory;
  });

  // Table Columns
  const bookColumns = [
    { title: "Book Name", dataIndex: "title" },
    { title: "Author", dataIndex: "author" },
    { title: "Category", dataIndex: "category" },
    {
      title: "Action",
      render: (_, r) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingBook(r);
              editForm.setFieldsValue(r);
              setIsEditModalVisible(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteBook(r)}
          />
        </Space>
      ),
    },
  ];

  // UI
  return (
    <Layout className="adminPage-container">
      {contextHolder}
      <Header className="common-header">
        <h1>E-Library Admin Dashboard</h1>
        <Button
          icon={<LogoutOutlined />}
          type="primary"
          danger
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Header>

      <Layout>
        {/* Book Management */}
        <Sider width="60%" className="adminPage-left">
          <Card
            title="Book Management"
            extra={
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => setIsAddModalVisible(true)}
              >
                Add Book
              </Button>
            }
          >
            <div className="adminPage-search-area">
              <Input
                placeholder="Search title / author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
              <Select
                mode="multiple"
                placeholder="Filter by Category"
                style={{ minWidth: 200 }}
                value={selectedCategories}
                onChange={setSelectedCategories}
                allowClear
              >
                {[...new Set(books.map((b) => b.category))].map((cat) => (
                  <Option key={cat}>{cat}</Option>
                ))}
              </Select>
            </div>
            <div className="adminPage-table-wrapper">
              <Table
                dataSource={filteredBooks}
                columns={bookColumns}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </div>
          </Card>
        </Sider>

        {/* User Management &&  Blacklist */}
        <Content className="adminPage-right">
          <Card title="User Management" style={{ marginBottom: 24 }}>
            <Table
              dataSource={users}
              columns={[
                { title: "Username", dataIndex: "username" },
                { title: "Email", dataIndex: "email" },
                {
                  title: "Action",
                  render: (_, r) => (
                    <Button
                      type="primary"
                      danger
                      icon={<UserAddOutlined />}
                      onClick={() => handleAddToBlacklist(r)}
                    >
                      Add to Blacklist
                    </Button>
                  ),
                },
              ]}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>

          <Card title="Blacklist">
            <Table
              dataSource={blacklist}
              columns={[
                { title: "Username", dataIndex: "username" },
                { title: "Reason", dataIndex: "reason" },
                {
                  title: "Action",
                  render: (_, r) => (
                    <Button
                      icon={<UserDeleteOutlined />}
                      onClick={() => handleRemoveFromBlacklist(r)}
                    >
                      Remove
                    </Button>
                  ),
                },
              ]}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Content>
      </Layout>

      {/* Add New Book */}
      <Modal
        title="Add New Book"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAddBook}
        okText="Confirm Add"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Book Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <Input type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Book */}
      <Modal
        title="Edit Book"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleUpdateBook}
        okText="Confirm Update"
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="title" label="Book Title">
            <Input />
          </Form.Item>
          <Form.Item name="author" label="Author">
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default AdminPage;