import React from "react";
import { Layout, Button, Input, Row, Col, Empty } from "antd";
import { LoginOutlined, SearchOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

function MainPage() {
  // 没接 API
  const books = null;

  function handleSearch(value) {
    console.log("Search:", value);
  }

  return (
    <Layout className="min-h-screen bg-white">
      {/* topside */}
      <Header className="bg-white border-b border-gray-200 px-6" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 style={{ color: "white", margin: 0, fontSize: 18, fontWeight: 600 }}>E-library management system</h1>
        </div>

        <Button type="primary" icon={<LoginOutlined />}>
          Login
        </Button>
      </Header>

      {/* content */}
      <Content className="max-w-5xl mx-auto px-4 py-8">

        {/* searchbar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <Input.Search
            placeholder="Search by title / author / category"
            enterButton={
              <>
                <SearchOutlined /> Search
              </>
            }
            size="large"
            onSearch={handleSearch}
            style={{ width: "90%", maxWidth: 800, marginTop: 50 }}
            allowClear
          />
        </div>

        {/* Data Flow */}
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12, marginLeft: 14, color: "blue" }}>Data Flow</h2>

          {/* 之后再补 */}
          {books === null || (Array.isArray(books) && books.length === 0) ? (
            <Empty description="No data yet (connect your API to show results here)" />
          ) : (
            <Row gutter={[16, 16]}>
              {books.map((book) => (
                <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                  {/* 之后再补 */}
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
