import React, { useEffect, useState } from "react";
import {
  Layout,
  Table,
  Button,
  Input,
  Select,
  Modal,
  Form,
  Space,
  Card,
  message,
  Pagination,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import apiClient from "./api/apiClient";
import { useNavigate } from "react-router-dom";
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

  // Pagination
  const [bookPage, setBookPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [blackPage, setBlackPage] = useState(1);
  const bookPageSize = 13;
  const userPageSize = 4;
  const blackPageSize = 4;

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
      const [booksRes, usersRes, blackRes] = await Promise.all([
        apiClient.get("/books"),
        apiClient.get("/users"),
        apiClient.get("/blacklist"),
      ]);
      setBooks(booksRes.data?.data || []);
      setUsers(usersRes.data?.data || []);
      setBlacklist(blackRes.data?.data || []);
    } catch (err) {
      console.error("Data loading failed:", err);
      message.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // book Management
  const handleAddBook = async () => {
    try {
      const values = await form.validateFields();
      const newBook = {
        title: values.title,
        author: values.author,
        category: values.category,
        quantity: 1,
      };
      await apiClient.post("/books", newBook);
      message.success("Book added successfully");
      setIsAddModalVisible(false);
      fetchAllData();
    } catch (err) {
      console.error(err);
      message.error("Failed to add book");
    }
  };

  const handleEditBook = async () => {
    try {
      const values = await editForm.validateFields();
      Modal.confirm({
        title: "Confirm Edit",
        content: "Are you sure to update this book",
        onOk: async () => {
          await apiClient.put(`/books/${editingBook.id}`, values);
          message.success("Book updated successfully");
          setIsEditModalVisible(false);
          fetchAllData();
        },
      });
    } catch (err) {
      console.error(err);
      message.error("Failed to update book");
    }
  };

  const handleDeleteBook = (record) => {
    Modal.confirm({
      title: "Confirm Delete",
      content: `Delete "${record.title}"?`,
      onOk: async () => {
        try {
          await apiClient.delete(`/books/${record.id}`);
          message.success("Book deleted successfully");
          fetchAllData();
        } catch (err) {
          message.error("Failed to delete book");
        }
      },
    });
  };

  // blacklist
  const handleAddToBlacklist = async (user) => {
    Modal.confirm({
      title: "Add to Blacklist",
      content: `Add ${user.username} to blacklist?`,
      onOk: async () => {
        try {
          await apiClient.post("/blacklist/add", {
            user_id: user.id,
            reason: "Multiple overdue returns",
          });
          message.warning(`${user.username} added to blacklist`);
          fetchAllData();
        } catch (err) {
          message.error("Failed to add to blacklist");
        }
      },
    });
  };

  const handleRemoveFromBlacklist = async (user) => {
    Modal.confirm({
      title: "Remove from Blacklist",
      content: `Remove ${user.username} from blacklist?`,
      onOk: async () => {
        try {
          await apiClient.delete(`/blacklist/remove/${user.id}`);
          message.success(`${user.username} removed from blacklist`);
          fetchAllData();
        } catch (err) {
          message.error("Failed to remove user");
        }
      },
    });
  };

  // Logout 
  const handleLogout = () => {
    localStorage.removeItem("user");
    message.info("Logged out successfully");
    navigate("/");
  };

  // Search / Filter
  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(b.category);
    return matchSearch && matchCategory;
  });

  // Paginated slices
  const currentBooks = filteredBooks.slice(
    (bookPage - 1) * bookPageSize,
    bookPage * bookPageSize
  );
  const currentUsers = users.slice((userPage - 1) * userPageSize, userPage * userPageSize);
  const currentBlacklist = blacklist.slice((blackPage - 1) * blackPageSize, blackPage * blackPageSize);

  return (
    <Layout className="adminPage-container">
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

            <div className="adminPage-table-container">
              <Table
                dataSource={currentBooks}
                columns={[
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
                ]}
                loading={loading}
                rowKey="id"
                pagination={false}
              />
            </div>

            {/* Pagination*/}
            <div className="adminPage-pagination">
              <Pagination
                current={bookPage}
                total={filteredBooks.length}
                pageSize={bookPageSize}
                onChange={(p) => setBookPage(p)}
                showSizeChanger={false}
              />
            </div>
          </Card>
        </Sider>

        {/* Right: User + Blacklist*/}
        <Content className="adminPage-right">
          {/* User Management */}
          <Card title="User Management">
            <div className="adminPage-table-container">
              <Table
                dataSource={currentUsers}
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
                pagination={false}
              />
            </div>

            <div className="adminPage-pagination">
              <Pagination
                current={userPage}
                total={users.length}
                pageSize={userPageSize}
                onChange={(p) => setUserPage(p)}
                showSizeChanger={false}
              />
            </div>
          </Card>

          {/* Blacklist */}
          <Card title="Blacklist">
            <div className="adminPage-table-container">
              <Table
                dataSource={currentBlacklist}
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
                pagination={false}
              />
            </div>

            <div className="adminPage-pagination">
              <Pagination
                current={blackPage}
                total={blacklist.length}
                pageSize={blackPageSize}
                onChange={(p) => setBlackPage(p)}
                showSizeChanger={false}
              />
            </div>
          </Card>
        </Content>
      </Layout>

      {/* Add / Edit Modals */}
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
        </Form>
      </Modal>

      <Modal
        title="Edit Book"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditBook}
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
