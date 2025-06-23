import React, { useRef } from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useSidebar } from "../../../context/SidebarContext";
import useClickOutside from "../../../hooks/useClickOutside";
import "./DashboardSidebar.css";
import { OpenSidebarBtnClass, ROUTES } from "../../../constants";
import useIsSmallScreen from "../../../hooks/isSmallScreen";
import { getCurrentRoute } from "../../../utils/routes";
import { useNavigateWithAuth } from "../../../utils/navigate";
import { isProtectedRoute } from "../../../utils";

const DashboardSidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const isMobile = useIsSmallScreen();
  const sidebarRef = useRef(null);
  const navigate = useNavigateWithAuth();

  useClickOutside(
    sidebarRef,
    () => {
      if (isMobile && isSidebarOpen) {
        toggleSidebar();
      }
    },
    OpenSidebarBtnClass
  );

  const sidebarItems = [
    { label: "Home", key: ROUTES.HOME, icon: <HomeOutlined /> },
    { label: "Dashboard", key: ROUTES.DASHBOARD, icon: <AppstoreOutlined /> },
    { label: "Products", key: ROUTES.PRODUCTS, icon: <ShoppingOutlined /> },
    { label: "Logout", key: ROUTES.LOGOUT, icon: <LogoutOutlined /> },
  ];

  const path = window.location.pathname;
  const selectedKey = getCurrentRoute(path) || "home";

  const handleMenuItemClick = (key: string) => {
    navigate(key);

    if (isMobile && isSidebarOpen) {
      toggleSidebar();
    }
  };

  if (!isSidebarOpen || !isProtectedRoute(path)) return null;

  return (
    <div ref={sidebarRef} className="custom-sidebar">
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={(e) => handleMenuItemClick(e.key)}
        style={{ height: "100%" }}
      >
        {sidebarItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default DashboardSidebar;
