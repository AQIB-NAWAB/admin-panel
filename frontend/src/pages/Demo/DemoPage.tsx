import React from "react";
import { Table } from "antd";
import { Line } from "@ant-design/charts";
import "../Dashboard/DashboardPage.css";
import { Layout } from "antd";

const { Content } = Layout;

// Mock data for demonstration
const mockStats = {
  totalProductsCount: 152,
  avgPrice: 89.99,
  lowStockCount: 8,
};

const mockChartData = [
  { date: "2024-01-01", count: 5 },
  { date: "2024-01-02", count: 8 },
  { date: "2024-01-03", count: 12 },
  { date: "2024-01-04", count: 15 },
  { date: "2024-01-05", count: 18 },
  { date: "2024-01-06", count: 22 },
  { date: "2024-01-07", count: 25 },
];

const mockProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "$99.99",
    stock: 45,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "$249.99",
    stock: 23,
    createdAt: "2024-01-14T14:20:00Z",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: "$79.99",
    stock: 67,
    createdAt: "2024-01-13T09:15:00Z",
  },
  {
    id: 4,
    name: "USB-C Cable",
    price: "$19.99",
    stock: 89,
    createdAt: "2024-01-12T16:45:00Z",
  },
  {
    id: 5,
    name: "Wireless Mouse",
    price: "$39.99",
    stock: 34,
    createdAt: "2024-01-11T11:30:00Z",
  },
];

const DemoPage = () => {
  const chartConfig = {
    data: mockChartData,
    xField: "date",
    yField: "count",
    point: { size: 5, shape: "diamond" },
    color: "#6366f1",
    smooth: true,
    height: 300,
    autoFit: true,
  };

  const tableColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    { title: "Stock", dataIndex: "stock", key: "stock" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        className="dashboard-container sidebar-closed"
        role="main"
        aria-label="Demo Dashboard Content"
      >
        <div className="card-row">
          <section className="card stats" aria-label="Statistics Overview">
            <div className="circle red">
              <p className="circle-label">Total</p>
              <p className="circle-value">{mockStats.totalProductsCount}</p>
            </div>
            <div className="circle green">
              <p className="circle-label">Avg Price</p>
              <p className="circle-value">${mockStats.avgPrice}</p>
            </div>
            <div className="circle blue">
              <p className="circle-label">Low Stock</p>
              <p className="circle-value">{mockStats.lowStockCount}</p>
            </div>
          </section>

          <section className="card chart" aria-label="Products Creation Chart">
            <h3>Products Created Over Time</h3>
            <Line {...chartConfig} />
          </section>
        </div>

        <section className="card table" aria-label="Recent Products Table">
          <h3>Recently Added Products</h3>
          <Table
            dataSource={mockProducts}
            columns={tableColumns}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </section>
      </Content>
    </Layout>
  );
};

export default DemoPage;