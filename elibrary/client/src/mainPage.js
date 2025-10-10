import React, { useState, useEffect } from "react";
import { Layout, Button, Input, Row, Col, Empty, message } from "antd";
import { LoginOutlined, SearchOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import "./css/common.css";
import "./css/mainPage.css";
import { getAllBooks, searchBooks } from "./api/bookApi";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;

function MainPage() {
  const [books, setBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await getAllBooks();
      if (Array.isArray(res.data)) {
        setBooks(res.data);
      } else {
        message.warning("No book data received.");
      }
    } catch (err) {
      console.error("Error loading books:", err);
      message.error("Failed to connect to the server. Please try again later.");
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      message.warning("Please enter a search keyword");
      return;
    }
    try {
      const res = await searchBooks(searchKeyword);
      setBooks(res.data || []);
      message.success(`Found ${(res.data || []).length} books.`);
    } catch (err) {
      console.error("Search error:", err);
      message.error("Search failed");
    }
  };

  return (
    <Layout className="mainPage-container">
      {/* Header */}
      <Header className="common-header">
        <h1>E-Library Management System</h1>
        <Button
          type="primary"
          icon={<LoginOutlined />}
          className="mainPage-loginbutton"
          onClick={() => navigate("/loginPage")}
        >
          Login
        </Button>
      </Header>

      {/* Main Content*/}
      <Content className="mainPage-midcontainer">
        {/* Search Bar */}
        <div className="mainPage-searchbar">
          <Input.Search
            placeholder="Search by title / author / category"
            enterButton={<><SearchOutlined /> Search</>}
            size="large"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={handleSearch}
            allowClear
          />
        </div>

        {/* Book List */}
        <div className="mainPage-booklist">
          <h2>Available Books</h2>
          {books.length === 0 ? (
            <Empty description="No books available." />
          ) : (
            <Row gutter={[16, 16]}>
              {books.map((book) => (
                <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                  <div className="mainPage-booklist-card">
                    <h3>{book.title}</h3>
                    <p>Author: {book.author}</p>
                    <p>Category: {book.category}</p>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default MainPage;
