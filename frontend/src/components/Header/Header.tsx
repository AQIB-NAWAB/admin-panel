import React from "react";
import { Layout, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
import { useNavigateWithAuth } from "../../utils/navigate";
import { ROUTES } from "../../constants";
import { useSidebar } from "../../context/SidebarContext";
import { isProtectedRoute } from "../../utils";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigateWithAuth();

  const currentPath = window.location.pathname;

  const isDashboardPage = isProtectedRoute(currentPath);

  const getRHActionsButtons = () => {
    if (isDashboardPage) {
      return (
        <Button className="btn open-sidebar-btn" onClick={toggleSidebar}>
          <MenuOutlined />
        </Button>
      );
    }

    if (isAuthenticated) {
      return (
        <Button className="btn" onClick={() => navigate(ROUTES.DASHBOARD)}>
          Dashboard
        </Button>
      );
    }

    return (
      <>
        <Button
          onClick={() => navigate(ROUTES.LOGIN)}
          style={{ marginRight: "10px" }}
          className="btn"
        >
          Login
        </Button>
        <Button className="btn" onClick={() => navigate(ROUTES.SIGNUP)}>
          Sign up
        </Button>
      </>
    );
  };

  return (
    <AntHeader className="custom-header">
      <div className="logo" onClick={() => navigate(ROUTES.HOME)}>
        🛒 Mega
      </div>
      <div className="header-right">{getRHActionsButtons()}</div>
    </AntHeader>
  );
};

export default Header;
