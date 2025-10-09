import React, { useState, useEffect } from "react";
import { Layout, Button, Input, Row, Col, Empty, message } from "antd";
import { LoginOutlined, SearchOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import "./css/common.css"
import "./css/mainPage.css";
import { getAllBooks, searchBooks } from "./api/bookApi";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;

function MainPage() {
  const [books, setBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  // Loading book data
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      // （后期改）
      // const res = await getAllBooks();
      // setBooks(res.data);
      setBooks([]);
      // （后期改）
    } catch (err) {
      message.error("Failed to load book");
    }
  };

  // search book
  const handleSearch = async () => {
    try {
      // （后期改）
      // const res = await searchBooks(searchTerm);
      // setBooks(res.data);
      message.info(`Search keywords: ${searchKeyword}`);
    } catch (err) {
      message.error("Search failed");
    }
  };

  return (
    <Layout className="mainPage-container">
      <Header className="common-header">
        <h1>E-Library Management System</h1>
        <div className="mainPage-rightheader">
          <Button
            type="primary"
            icon={<LoginOutlined />}
            className="mainPage-loginbutton"
            onClick={() => navigate("/loginPage")}
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
            <Empty description="There are currently no books to display" />
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