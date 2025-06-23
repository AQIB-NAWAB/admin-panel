import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";
import { Product } from "../constants/interfaces";
import { config } from "../constants/config";

type TimeSeriesType = {
  date: Date;
  count: number;
}[];

type DashboardStatsType = {
  totalProductsCount: number;
  avgPrice: number;
  lowStockCount: number;
  poductCreationTimeSeriesData: TimeSeriesType;
};

export type DashboardContextType = {
  loading: boolean;
  recentProducts: Product[];
  allProducts: Product[];
  totalProducts: number;
  page: number;
  pageSize: number;
  dashboardStats: DashboardStatsType;

  getDashboardStats: () => Promise<void>;

  /**
   * Fetch products with pagination + optional filters:
   *   - search: substring match on name
   *   - minPrice, maxPrice: numeric range
   *   - lowStockOnly: boolean
   */
  getAllProducts: (
    page?: number,
    limit?: number,
    filters?: {
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      lowStockOnly?: boolean;
    }
  ) => Promise<void>;

  createProduct: (data: FormData) => Promise<void>;
  replaceProductImage: (productId: string, file: File) => Promise<void>;
  editProduct: (productId: string, data: Partial<Product>) => Promise<void>;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [dashboardStats, setDashboardStats] = useState<DashboardStatsType>({
    totalProductsCount: 0,
    avgPrice: 0,
    lowStockCount: 0,
    poductCreationTimeSeriesData: [],
  });

  const getDashboardStats = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${config.API_URL}/dashboard`, {
        withCredentials: true,
      });
      const data = resp.data;

      setRecentProducts(data.recentProducts);
      setDashboardStats({
        totalProductsCount: data.stats.totalProductsCount,
        avgPrice: parseFloat(data.stats.avgPrice),
        lowStockCount: data.stats.lowStockCount,
        poductCreationTimeSeriesData:
          data.stats.poductCreationTimeSeriesData.map((item: any) => ({
            date: new Date(item.date),
            count: parseInt(item.count, 10),
          })),
      });
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAllProducts = async (
    pageArg = page,
    limitArg = pageSize,
    filters: {
      search?: string;
      minPrice?: number;
      maxPrice?: number;
      lowStockOnly?: boolean;
    } = {}
  ) => {
    try {
      setLoading(true);

      // update local pagination state
      setPage(pageArg);
      setPageSize(limitArg);

      // build query params
      const params: any = { page: pageArg, limit: limitArg };
      if (filters.search) params.search = filters.search;
      if (filters.minPrice != null) params.minPrice = filters.minPrice;
      if (filters.maxPrice != null) params.maxPrice = filters.maxPrice;
      if (filters.lowStockOnly) params.lowStockOnly = true;

      const resp = await axios.get(`${config.API_URL}/products`, {
        params,
        withCredentials: true,
      });

      // expects backend → { data: Product[], total: number, page, limit, totalPages }
      const { data, total } = resp.data;
      setAllProducts(data);
      setTotalProducts(total);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (formData: FormData) => {
    try {
      setLoading(true);
      await axios.post(`${config.API_URL}/products`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      // refresh current page
      await getAllProducts(page, pageSize);
    } catch (err) {
      console.error("Error creating product:", err);
    } finally {
      setLoading(false);
    }
  };

  const replaceProductImage = async (productId: string, file: File) => {
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("image", file);
      await axios.patch(`${config.API_URL}/products/${productId}/image`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      await getAllProducts(page, pageSize);
    } catch (err) {
      console.error("Error replacing image:", err);
    } finally {
      setLoading(false);
    }
  };

  const editProduct = async (productId: string, data: Partial<Product>) => {
    try {
      setLoading(true);
      await axios.put(`${config.API_URL}/products/${productId}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      await getAllProducts(page, pageSize);
    } catch (err) {
      console.error("Error editing product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        loading,
        recentProducts,
        allProducts,
        totalProducts,
        page,
        pageSize,
        dashboardStats,
        getDashboardStats,
        getAllProducts,
        createProduct,
        replaceProductImage,
        editProduct,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be inside DashboardProvider");
  return ctx;
};
