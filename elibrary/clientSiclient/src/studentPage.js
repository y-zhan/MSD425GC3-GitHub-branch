import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Input, Card, Modal, Select, message } from "antd";
import { BookOutlined, ClockCircleOutlined, LogoutOutlined } from "@ant-design/icons";
import "./css/studentPage.css";
import "antd/dist/reset.css";

const { Header, Content, Sider } = Layout;

function StudentPage() {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [dueSoonBooks, setDueSoonBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowDuration, setBorrowDuration] = useState(7);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // fetch API data
      } catch (err) {
        message.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleBorrowClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleBorrowConfirm = () => {
    message.success(`Borrowed "${selectedBook.title}" for ${borrowDuration} days`);
    setIsModalOpen(false);
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
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  const dueSoonColumns = [
    { title: "Book Name", dataIndex: "title", key: "title" },
    { title: "Return Date", dataIndex: "returnDate", key: "returnDate" },
    {
      title: "Days Left",
      dataIndex: "daysLeft",
      key: "daysLeft",
      render: (days) => (
        <span className={days <= 3 ? "due-danger" : "due-normal"}>
          {days} days
        </span>
      ),
    },
  ];

  return (
    <Layout className="studentPage-container">
      <Header className="studentPage-header">
        <h1>E-Library Management System - Student Portal</h1>
      </Header>

      <Layout>
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
            <Table
              dataSource={books}
              columns={bookColumns}
              loading={loading}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              className="studentPage-table"
            />
          </Card>
        </Sider>

        <Content className="studentPage-right">
          <div className="studentPage-righttop">
            <Card title="Student Info" bordered={false}>
              <p><strong>Username:</strong> Mengnan Liu</p>
              <p><strong>Status:</strong> Active</p>
              <h4>Currently Borrowed:</h4>
              <Table
                dataSource={borrowedBooks}
                columns={borrowedColumns}
                loading={loading}
                rowKey="id"
                pagination={false}
                size="small"
                className="studentPage-righttopTable"
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
                rowKey="id"
                pagination={false}
                size="small"
                className="studentPage-rightbottomTable"
              />
            </Card>
          </div>
        </Content>
      </Layout>

      <Modal
        title={`Borrow "${selectedBook?.title}"`}
        open={isModalOpen}
        onOk={handleBorrowConfirm}
        onCancel={() => setIsModalOpen(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Please select the borrowing duration:</p>
        <Select
          value={borrowDuration}
          className="studentPage-select"
          onChange={(value) => setBorrowDuration(value)}
          options={[
            { value: 7, label: "7 days" },
            { value: 14, label: "14 days" },
            { value: 21, label: "21 days" },
          ]}
        />
      </Modal>
    </Layout>
  );
}

export default StudentPage;
