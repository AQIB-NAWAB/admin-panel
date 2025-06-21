import React from "react";
import { Layout, Row, Col, Typography, Button } from "antd";
import { useNavigateWithAuth } from "../../utils/navigate";
import { HeroImg2, ROUTES } from "../../constants";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const Home: React.FC = () => {
  const navigateWithAuth = useNavigateWithAuth();
  const { isAuthenticated } = useAuth();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "50px", background: "white" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ minHeight: "80vh" }}
        >
          <Col
            xs={24}
            md={12}
            style={{ textAlign: "left", paddingRight: "20px" }}
          >
            <Title level={1} className="title" >Welcome to Mega Managment</Title>
            <Paragraph className="description">
              Manage your products and settings with ease. Get started by
              logging in or exploring the dashboard.
            </Paragraph>
            {isAuthenticated ? (
              <Button
                type="primary"
                size="large"
                onClick={() => navigateWithAuth(ROUTES.LOGIN)}
                style={{ marginRight: "10px" }}
              >
                Login
              </Button>
            ) : (
              <Button
                size="large"
                onClick={() => navigateWithAuth(ROUTES.DASHBOARD)}
                style={{ marginLeft: "10px" }}
                className="btn"
              >
                Dashboard
              </Button>
            )}
          </Col>
          <Col
            xs={24}
            md={12}
            style={{ textAlign: "center", paddingLeft: "20px" }}
          >
            <div className="image-container">
              <img
                src={HeroImg2}
                alt="Admin Panel Illustration"
                className="floating-image"
                style={{ maxWidth: "100%", height: "auto" }}
                loading="lazy"
              />
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Home;
