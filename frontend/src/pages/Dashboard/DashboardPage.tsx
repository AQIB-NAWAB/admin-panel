import { Table } from "antd";
import { Line } from "@ant-design/charts";
import "./DashboardPage.css";
import { useSidebar } from "../../context/SidebarContext";
import { useMemo, useEffect } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader/Loader";

const DashboardPage = () => {
  const { isSidebarOpen } = useSidebar();
  const { isAuthenticated } = useAuth();
  const { loading, dashboardStats, recentProducts, getDashboardStats } =
    useDashboard();

  useEffect(() => {
    if (isAuthenticated) {
      getDashboardStats();
    }
  }, []);

  const chartData = useMemo(
    () =>
      dashboardStats.poductCreationTimeSeriesData.map((item) => ({
        date: item.date.toLocaleDateString(),
        count: item.count,
      })),
    [dashboardStats.poductCreationTimeSeriesData]
  );

  const chartConfig = {
    data: chartData,
    xField: "date",
    yField: "count",
    point: { size: 5, shape: "diamond" },
    color: "#3642f0",
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

  if (loading) {
    return <Loader />;
  }

  return (
    <main
      className={`dashboard-container ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
      role="main"
      aria-label="Dashboard Content"
    >
      <div className="card-row">
        <section className="card stats" aria-label="Statistics Overview">
          <div className="circle red">
            <p className="circle-label">Total</p>
            <p className="circle-value">{dashboardStats.totalProductsCount}</p>
          </div>
          <div className="circle green">
            <p className="circle-label">Avg Price</p>
            <p className="circle-value">
              ${dashboardStats.avgPrice.toFixed(2)}
            </p>
          </div>
          <div className="circle blue">
            <p className="circle-label">Low Stock</p>
            <p className="circle-value">{dashboardStats.lowStockCount}</p>
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
          dataSource={recentProducts}
          columns={tableColumns}
          rowKey="id"
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </section>
    </main>
  );
};

export default DashboardPage;
