import React, { useState, useEffect } from "react";
import { Layout, Button, Input, Row, Col, Empty, message, Select } from "antd";
import { LoginOutlined, SearchOutlined, DeleteOutlined, BookOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllBooks } from "./api/bookApi";
import "antd/dist/reset.css";
import "./css/common.css";
import "./css/mainPage.css";

const { Header, Content } = Layout;
const { Option } = Select;

function MainPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const res = await getAllBooks();
      const data = res.data || [];
      setBooks(data);
      setAllBooks(data);
    } catch {
      message.error("Failed to connect to server.");
    }
  };

  // Search handler
  const handleSearch = () => {
    const keyword = searchKeyword.trim().toLowerCase();
    let filtered = [...allBooks];

    // Filter by keyword
    if (keyword) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(keyword) ||
          b.author.toLowerCase().includes(keyword)
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((b) =>
        selectedCategories.includes(b.category)
      );
    }

    setBooks(filtered);
    if (filtered.length > 0) {
      message.success(`Found ${filtered.length} matching book(s).`);
    } else {
      message.warning("No books matched your search.");
    }
  };

  // Reset filters
  const resetSearch = () => {
    setSearchKeyword("");
    setSelectedCategories([]);
    setBooks(allBooks);
    message.info("Filters cleared. Showing all books.");
  };

  // Extract unique categories
  const categoryOptions = [...new Set(allBooks.map((b) => b.category))];

  // UI
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

      {/* Main Content */}
      <Content className="mainPage-content">
        {/* Search Section */}
        <div className="mainPage-searchbar">
          <Row gutter={8} justify="center">
            {/* Text Input */}
            <Col xs={24} sm={9}>
              <Input
                placeholder="Enter book title or author"
                size="large"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </Col>

            {/* Category Filter */}
            <Col xs={24} sm={7}>
              <Select
                mode="multiple"
                allowClear
                placeholder="Filter by category"
                size="large"
                style={{ width: "100%" }}
                value={selectedCategories}
                onChange={(values) => setSelectedCategories(values)}
              >
                {categoryOptions.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </Col>

            {/* Search Button */}
            <Col xs={12} sm={4}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                size="large"
                block
                onClick={handleSearch}
              >
                Search
              </Button>
            </Col>

            {/* Clear Button */}
            <Col xs={12} sm={4}>
              <Button
                danger
                icon={<DeleteOutlined />}
                size="large"
                block
                onClick={resetSearch}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </div>

        {/* Book List */}
        <div className="mainPage-booklist">
          <h2 className="mainPage-section-title">Available Books</h2>
          {books.length === 0 ? (
            <Empty description="No books available." />
          ) : (
            <Row gutter={[16, 16]}>
              {books.map((book) => (
                <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                  <div className="mainPage-bookcard">
                    <h3>{book.title}</h3>
                    <p>
                      <strong>Author:</strong> {book.author}
                    </p>
                    <p>
                      <strong>Category:</strong> {book.category}
                    </p>
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
