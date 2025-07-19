import React from "react";
import { Layout, Row, Col, Typography, Button } from "antd";
import { useNavigateWithAuth } from "../../utils/navigate";
import { HeroImg2, ROUTES } from "../../constants";
import "./Home.css";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const HomePage: React.FC = () => {
  const navigateWithAuth = useNavigateWithAuth();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content className="home-content">
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
            <Title level={1} className="title">
              Welcome to Mega Managment
            </Title>
            <Paragraph className="description">
              Manage your products and settings with ease. Get started by
              logging in or exploring the dashboard.
            </Paragraph>
            <Button
              size="large"
              onClick={() => navigateWithAuth(ROUTES.DASHBOARD)}
              style={{ marginRight: "16px" }}
              className="btn"
            >
              Let's Get Started
            </Button>
            <Button
              size="large"
              onClick={() => navigateWithAuth(ROUTES.DEMO)}
              className="btn-secondary"
            >
              View Demo
            </Button>
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

export default HomePage;
