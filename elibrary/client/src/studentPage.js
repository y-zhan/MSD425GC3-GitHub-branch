import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Button,
  Input,
  Card,
  Modal,
  Select,
  message,
  Pagination,
} from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { getAllBooks } from "./api/bookApi";
import {
  borrowBook,
  returnBook,
  getAllBorrowRecords,
} from "./api/studentApi";
import { useNavigate } from "react-router-dom";
import "./css/common.css";
import "./css/studentPage.css";
import "antd/dist/reset.css";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

function StudentPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [dueSoonBooks, setDueSoonBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowDuration, setBorrowDuration] = useState(7);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // initialization
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      message.warning("Please log in first");
      navigate("/loginPage");
      return;
    }
    const parsed = JSON.parse(storedUser);
    setUser(parsed);
    fetchAllData(parsed.id);
  }, []);

  // Fetch all data
  const fetchAllData = async (userId) => {
    try {
      setLoading(true);
      const [bookRes, recordRes] = await Promise.all([
        getAllBooks(),
        getAllBorrowRecords(),
      ]);

      const allBooks = bookRes.data || [];
      const allRecords = recordRes.data || [];

      const myRecords = allRecords.filter(
        (r) => r.username === user?.username
      );

      setBorrowedBooks(
        myRecords
          .filter((r) => r.status === "borrowed")
          .map((r) => ({
            id: r.id ?? r.record_id ?? r.key,
            title: r.title,
            borrowDate: r.borrow_date,
            returnDate: r.return_date,
            status: r.status,
          }))
      );

      const now = new Date();
      const dueSoon = myRecords
        .filter((r) => {
          const diffDays = Math.ceil(
            (new Date(r.return_date) - now) / (1000 * 60 * 60 * 24)
          );
          return diffDays <= 2 && r.status === "borrowed";
        })
        .map((r) => ({
          id: r.id ?? r.record_id ?? r.key,
          title: r.title,
          returnDate: r.return_date,
          daysLeft: Math.ceil(
            (new Date(r.return_date) - now) / (1000 * 60 * 60 * 24)
          ),
        }));
      setDueSoonBooks(dueSoon);

      setBooks(allBooks.filter((b) => b.available));
    } catch (err) {
      console.error(err);
      message.error("Failed to load data, please check backend connection");
    } finally {
      setLoading(false);
    }
  };

  // Borrow book
  const handleBorrowClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleBorrowConfirm = async () => {
    try {
      if (!user) return message.warning("Please log in again");
      await borrowBook({
        user_id: user.id,
        book_id: selectedBook.id,
        days: borrowDuration,
      });
      message.success(
        `Successfully borrowed "${selectedBook.title}" for ${borrowDuration} days`
      );
      setIsModalOpen(false);
      fetchAllData(user.id);
    } catch (err) {
      console.error(err);
      message.error("Failed to borrow the book");
    }
  };

  // Return book
  const handleReturnBook = (record) => {
    const recordId = record?.id ?? record?.record_id ?? record?.key;
    if (!recordId) {
      message.error("Unable to identify record ID, please refresh the page.");
      return;
    }

    Modal.confirm({
      title: "Confirm Return",
      content: `Are you sure you want to return "${record.title}"?`,
      onOk: async () => {
        try {
          await returnBook(recordId);
          message.success(`"${record.title}" has been successfully returned`);
          fetchAllData(user.id);
        } catch (err) {
          console.error(err);
          message.error("Return failed, please try again later");
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

  // Table Columns
  const bookColumns = [
    { title: "Book Name", dataIndex: "title", key: "title" },
    { title: "Author", dataIndex: "author", key: "author" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleBorrowClick(record)}>
          Borrow
        </Button>
      ),
    },
  ];

  const borrowedColumns = [
    { title: "Book Name", dataIndex: "title", key: "title" },
    { title: "Borrow Date", dataIndex: "borrowDate", key: "borrowDate" },
    { title: "Return Date", dataIndex: "returnDate", key: "returnDate" },
    {
      title: "Action",
      render: (_, record) => (
        <Button danger onClick={() => handleReturnBook(record)}>
          Return
        </Button>
      ),
    },
  ];

  const dueSoonColumns = [
    { title: "Book Name", dataIndex: "title", key: "title" },
    { title: "Return Date", dataIndex: "returnDate", key: "returnDate" },
    {
      title: "Days Left",
      dataIndex: "daysLeft",
      key: "daysLeft",
      render: (days) => (
        <span className={days <= 2 ? "due-danger" : "due-normal"}>
          {days} days
        </span>
      ),
    },
    {
      title: "Action",
      render: (_, record) => (
        <Button danger onClick={() => handleReturnBook(record)}>
          Return
        </Button>
      ),
    },
  ];

  // Pagination Handler
  const pageSize = 13;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentBooks = books.slice(startIndex, endIndex);

  return (
    <Layout className="studentPage-container">
      <Header className="common-header">
        <h1>E-Library Management System - Student Portal</h1>
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
        {/* Left Section*/}
        <Sider width="60%" className="studentPage-left">
          <Card
            title={
              <span>
                <BookOutlined /> Available Books
              </span>
            }
            bordered={false}
          >
            <Input.Search
              placeholder="Search books by title / author / category"
              allowClear
              className="studentPage-search"
            />

            <div className="studentPage-table-container">
              <Table
                dataSource={currentBooks}
                columns={bookColumns}
                loading={loading}
                rowKey="id"
                pagination={false}
                className="studentPage-table"
              />
            </div>

            {/* Pagination */}
            <div className="studentPage-pagination">
              <Pagination
                current={currentPage}
                total={books.length}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </Card>
        </Sider>

        {/* Right Section*/}
        <Content className="studentPage-right">
          <div className="studentPage-righttop">
            <Card title="My Borrowed Books" bordered={false}>
              <p>
                <strong>Username:</strong> {user?.username}
              </p>
              <p>
                <strong>Status:</strong> Active
              </p>
              <Table
                dataSource={borrowedBooks}
                columns={borrowedColumns}
                loading={loading}
                rowKey={(r) => r.id ?? r.record_id ?? r.key}
                pagination={false}
                size="small"
              />
            </Card>
          </div>

          <div className="studentPage-rightbottom">
            <Card
              title={
                <span>
                  <ClockCircleOutlined /> Due Soon
                </span>
              }
              bordered={false}
            >
              <Table
                dataSource={dueSoonBooks}
                columns={dueSoonColumns}
                loading={loading}
                rowKey={(r) => r.id ?? r.record_id ?? r.key}
                pagination={false}
                size="small"
              />
            </Card>
          </div>
        </Content>
      </Layout>

      {/* Borrow Modal */}
      <Modal
        title={`Borrow "${selectedBook?.title}"`}
        open={isModalOpen}
        onOk={handleBorrowConfirm}
        onCancel={() => setIsModalOpen(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Please select borrowing duration:</p>
        <Select
          value={borrowDuration}
          className="studentPage-select"
          onChange={(v) => setBorrowDuration(v)}
        >
          <Option value={1}>1 day</Option>
          <Option value={7}>7 days</Option>
          <Option value={14}>14 days</Option>
          <Option value={21}>21 days</Option>
        </Select>
      </Modal>
    </Layout>
  );
}

export default StudentPage;
