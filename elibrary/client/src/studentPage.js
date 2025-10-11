import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Input, Card, Modal, Select, message, Space, } from "antd";
import { BookOutlined, ClockCircleOutlined, LogoutOutlined, ExclamationCircleOutlined, } from "@ant-design/icons";
import { getAllBooks } from "./api/bookApi";
import { borrowBook, returnBook, getAllBorrowRecords, getBlacklist, } from "./api/studentApi";
import { useNavigate } from "react-router-dom";
import "./css/common.css";
import "./css/studentPage.css";
import "antd/dist/reset.css";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

const ConfirmReturnModal = ({ open, onConfirm, onCancel, bookTitle }) => {
  return (
    <Modal
      open={open}
      title="Confirm Return"
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Confirm"
      cancelText="Cancel"
      closable
    >
      <p>
        Are you sure you want to return <strong>{bookTitle}</strong>?
      </p>
    </Modal>
  );
};

function StudentPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [dueSoonBooks, setDueSoonBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowDuration, setBorrowDuration] = useState(7);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Initialization
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      message.warning("Please log in first");
      navigate("/loginPage");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchAllData(parsedUser.id, parsedUser.username);
  }, []);

  const fetchAllData = async (userId, username) => {
    try {
      setLoading(true);
      const [bookRes, recordRes] = await Promise.all([
        getAllBooks(),
        getAllBorrowRecords(),
      ]);

      const allBooks = bookRes.data || bookRes || [];
      const allRecords = recordRes.data || recordRes || [];
      const myRecords = allRecords.filter((r) => r.username === username);

      setBorrowedBooks(
        myRecords
          .filter((r) => r.status === "borrowed")
          .map((r) => ({
            id: r.id,
            title: r.title,
            borrowDate: r.borrow_date,
            returnDate: r.return_date,
            status: r.status,
          }))
      );

      const now = new Date();
      const dueSoon = myRecords
        .filter((r) => {
          if (!r.return_date) return false;
          const diffDays = Math.ceil(
            (new Date(r.return_date) - now) / (1000 * 60 * 60 * 24)
          );
          return diffDays <= 2 && r.status === "borrowed";
        })
        .map((r) => ({
          id: r.id,
          title: r.title,
          returnDate: r.return_date,
          daysLeft: Math.ceil(
            (new Date(r.return_date) - now) / (1000 * 60 * 60 * 24)
          ),
        }));

      setDueSoonBooks(dueSoon);
      setBooks(allBooks.filter((b) => b.available));
    } catch (err) {
      console.error("Fetch error:", err);
      message.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowClick = async (book) => {
    try {
      // check blacklist first
      const blacklistRes = await getBlacklist();
      const list = blacklistRes.data || [];
      const isBlacklisted = list.some((u) => u.username === user.username);
      if (isBlacklisted) {
        Modal.warning({
          title: "Borrowing Restricted",
          icon: <ExclamationCircleOutlined />,
          content: "Your credit score is too low to borrow books.",
        });
        return;
      }

      setSelectedBook(book);
      setIsBorrowModalOpen(true);
    } catch (err) {
      console.error("Blacklist check failed:", err);
      message.error("Unable to verify blacklist status.");
    }
  };

  // borrow
  const handleBorrowConfirm = async () => {
    if (!user || !selectedBook?.id) {
      message.warning("Please re-login before borrowing.");
      return;
    }

    try {
      const payload = {
        user_id: user.id,
        book_id: selectedBook.id,
        days: borrowDuration,
      };
      const res = await borrowBook(payload);

      if (res?.message?.includes("borrowed successfully")) {
        message.success(`Successfully borrowed "${selectedBook.title}"`);
        setIsBorrowModalOpen(false);
        fetchAllData(user.id, user.username);
      } else {
        Modal.warning({
          title: "Borrow Failed",
          content: res?.error || "Failed to borrow the book.",
        });
      }
    } catch (err) {
      console.error("Borrow error:", err);
      message.error("Failed to borrow the book.");
    }
  };

  const handleReturnBook = (record) => {
    console.log("Return clicked:", record);
    setSelectedRecord(record);
    setIsReturnModalOpen(true);
  };

  const handleConfirmReturn = async () => {
    const record = selectedRecord;
    if (!record?.id) {
      message.error("Cannot identify borrow record ID.");
      return;
    }

    try {
      console.log("Sending PUT request for record:", record.id);
      const res = await returnBook(record.id);
      console.log("Lambda response:", res);

      if (res?.message?.includes("returned successfully")) {
        message.success(`"${record.title}" returned successfully`);
        setIsReturnModalOpen(false);
        fetchAllData(user.id, user.username);
      } else {
        message.error(res?.error || "Return failed");
      }
    } catch (err) {
      console.error("Return error:", err);
      message.error("Failed to return the book.");
    }
  };

  const filteredBooks = books.filter((b) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      b.title?.toLowerCase().includes(keyword) ||
      b.author?.toLowerCase().includes(keyword) ||
      b.category?.toLowerCase().includes(keyword)
    );
  });

  // logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    message.info("Logged out");
    navigate("/");
  };

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
  ];

  //  UI
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
        {/* 左侧：可借书籍 */}
        <Sider width="60%" className="studentPage-left">
          <Card
            title={
              <Space>
                <BookOutlined />
                <span>Available Books</span>
              </Space>
            }
            variant="borderless"
          >
            <div className="studentPage-search-area">
              <Input.Search
                placeholder="Search books by title / author / category"
                allowClear
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <Table
              dataSource={filteredBooks}
              columns={bookColumns}
              loading={loading}
              rowKey={(r) => r.id ?? r.key}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Sider>

        {/* 右侧：借阅信息 */}
        <Content className="studentPage-right">
          <Card title="My Borrowed Books" variant="borderless">
            <p>
              <strong>Username:</strong> {user?.username}
            </p>
            <Table
              dataSource={borrowedBooks}
              columns={borrowedColumns}
              rowKey={(r) => r.id ?? r.key}
              pagination={false}
              size="small"
            />
          </Card>

          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Due Soon</span>
              </Space>
            }
            variant="borderless"
            style={{ marginTop: 20 }}
          >
            <Table
              dataSource={dueSoonBooks}
              columns={dueSoonColumns}
              rowKey={(r) => r.id ?? r.key}
              pagination={false}
              size="small"
            />
          </Card>
        </Content>
      </Layout>

      {/* 借书弹窗 */}
      <Modal
        title={`Borrow "${selectedBook?.title}"`}
        open={isBorrowModalOpen}
        onOk={handleBorrowConfirm}
        onCancel={() => setIsBorrowModalOpen(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Please select borrowing duration:</p>
        <Select
          value={borrowDuration}
          onChange={(v) => setBorrowDuration(v)}
          className="studentPage-select"
        >
          <Option value={1}>1 day</Option>
          <Option value={7}>7 days</Option>
          <Option value={14}>14 days</Option>
          <Option value={21}>21 days</Option>
        </Select>
      </Modal>

      {/* 还书确认弹窗 */}
      <ConfirmReturnModal
        open={isReturnModalOpen}
        onConfirm={handleConfirmReturn}
        onCancel={() => setIsReturnModalOpen(false)}
        bookTitle={selectedRecord?.title}
      />
    </Layout>
  );
}

export default StudentPage;
