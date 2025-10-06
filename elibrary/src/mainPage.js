import React, { useState, useEffect } from "react";
import { Layout, Button, Input, Row, Col, Empty, message } from "antd";
import { LoginOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import "./css/mainPage.css";

import { getAllBooks, searchBooks } from "./api/bookApi";
const { Header, Content } = Layout;

function MainPage() {
  const [books, setBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await getAllBooks();
        setBooks(response.data);
      } catch (error) {
        message.error("获取书籍失败，请检查 API");
      }
    }
    fetchBooks();
  }, []);

  const handleSearch = async (value) => {
    try {
      const response = await searchBooks(value);
      setBooks(response.data);
    } catch (error) {
      message.error("搜索失败");
    }
  };

  return (
    <Layout className="mainPage-container">
      <Header className="mainPage-header">
        <div className="mainPage-leftheader">
          <h1>E-Library Management System</h1>
        </div>
        <div className="mainPage-rightheader">
          <Button
            type="primary"
            icon={<LoginOutlined />}
            className="mainPage-loginbutton"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </Header>

      <Content className="mainPage-midcontainer">
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

        <div className="mainPage-booklist">
          <h2>Available Books</h2>
          {books.length === 0 ? (
            <Empty description="No Api now" />
          ) : (
            <Row gutter={[16, 16]}>
              {books.map((book) => (
                <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                  <div className="mainPage-booklist-card">
                    <h3>{book.title}</h3>
                    <p>Author: {book.author}</p>
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