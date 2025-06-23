import React, {
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  Table,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Slider,
  Select,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useSidebar } from "../../context/SidebarContext";
import { useDashboard } from "../../context/DashboardContext";
import ViewProductModal from "../../components/Modals/ViewProductModal";
import CreateProductModal from "../../components/Modals/CreateProductModal";
import EditProductModal from "../../components/Modals/EditProductModal";
import Loader from "../../components/Loader/Loader";
import { Product } from "../../constants/interfaces";
import "./ProductsPage.css";
import useDebounce from "../../hooks/useDebounce";

const { Title } = Typography;
const { Option } = Select;



const ProductsPage: React.FC = () => {
  const { isSidebarOpen } = useSidebar();
  const {
    allProducts,
    totalProducts,
    page,
    pageSize,
    loading,
    getAllProducts,
    createProduct,
    replaceProductImage,
    editProduct,
  } = useDashboard();

  // filters
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "in">("all");

  // modals
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // fetch on mount
  useEffect(() => {
    getAllProducts(1, pageSize);
  }, []);

  // refetch when pagination or any filter changes
  useEffect(() => {
    const lowOnly = stockFilter === "low";
    const [min, max] = priceRange;

    getAllProducts(page, pageSize, {
      search: debouncedSearch,
      minPrice: min,
      maxPrice: max,
      lowStockOnly: lowOnly,
    });
  }, [page, pageSize, debouncedSearch, priceRange, stockFilter]);

  // action handlers
  const handleView = useCallback((p: Product) => {
    setSelectedProduct(p);
    setViewModalVisible(true);
  }, []);

  const handleEdit = useCallback((p: Product) => {
    setSelectedProduct(p);
    setEditModalVisible(true);
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedProduct(null);
    setCreateModalVisible(true);
  }, []);

  const handleProductCreate = useCallback(
    async (values: Partial<Product>, file: File) => {
      const fd = new FormData();
      fd.append("name", values.name!);
      fd.append("description", values.description!);
      fd.append("price", String(values.price));
      fd.append("stock", String(values.stock));
      fd.append("image", file);
      await createProduct(fd);
      setCreateModalVisible(false);
    },
    [createProduct]
  );

  const handleProductEdit = useCallback(
    async (values: Partial<Product>) => {
      if (!selectedProduct) return;
      await editProduct(selectedProduct.id, values);
      setEditModalVisible(false);
    },
    [editProduct, selectedProduct]
  );

  const handleImageReplace = useCallback(
    async (file: File) => {
      if (!selectedProduct) return;
      await replaceProductImage(selectedProduct.id, file);
      setEditModalVisible(false);
    },
    [replaceProductImage, selectedProduct]
  );

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", ellipsis: true },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (p: number) => `$${p}`,
    },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string | Date) => new Date(d).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, rec: Product) => (
        <>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(rec)}
            style={{ marginRight: 8 }}
          />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(rec)} />
        </>
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <main
      className={`products-container ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <div className="header-section">
        <Title level={2}>Products</Title>
        <Button icon={<PlusOutlined />} onClick={handleCreate}>
          Add Product
        </Button>
      </div>

      <Row gutter={[16, 16]} className="filters-row">
        <Col xs={24} md={8}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} md={8}>
          <Slider
            range
            min={0}
            max={5000}
            value={priceRange}
            onChange={(v) => setPriceRange(v as [number, number])}
            tooltip={{ formatter: (v) => `$${v}` }}
            marks={{
              0: "$20",
              5000: "$25000",
            }}
          />
        </Col>
        <Col xs={24} md={8}>
          <Select
            value={stockFilter}
            onChange={(v) => setStockFilter(v)}
            style={{ width: "100%" }}
          >
            <Option value="all">All</Option>
            <Option value="low">Low (≤5)</Option>
            <Option value="in">In Stock (5)</Option>
          </Select>
        </Col>
      </Row>

      <Table
        dataSource={allProducts}
        columns={columns}
        rowKey="id"
        pagination={{
          current: page,
          pageSize,
          total:totalProducts,
          showSizeChanger: true,
          onChange: (newPage, newSize) =>
            getAllProducts(newPage, newSize, {
              search: debouncedSearch,
              minPrice: priceRange[0],
              maxPrice: priceRange[1],
              lowStockOnly: stockFilter === "low",
            }),
        }}
        scroll={{ x: "max-content" }}
      />
      <ViewProductModal
        visible={viewModalVisible}
        product={selectedProduct}
        onCancel={() => setViewModalVisible(false)}
      />
      <CreateProductModal
        visible={createModalVisible}
        onSubmit={handleProductCreate}
        onCancel={() => setCreateModalVisible(false)}
      />
      <EditProductModal
        visible={editModalVisible}
        product={selectedProduct}
        onFormSubmit={handleProductEdit}
        onImageSubmit={handleImageReplace}
        onCancel={() => setEditModalVisible(false)}
      />
    </main>
  );
};

export default ProductsPage;
