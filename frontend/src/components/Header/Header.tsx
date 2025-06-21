import React from "react";
import { Layout, Button } from "antd";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
import { useNavigateWithAuth } from "../../utils/navigate";
import { ROUTES } from "../../constants";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigateWithAuth();

  const getRHActionsButtons = () => {
    if (isAuthenticated) {
      return (
        <Button className="btn" onClick={() => navigate(ROUTES.DASHBOARD)}>Dashboard</Button>
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
        <Button className="btn" onClick={() => navigate(ROUTES.SIGNUP)}>Sign up</Button>
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
