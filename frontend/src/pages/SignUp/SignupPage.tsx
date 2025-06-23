import React, { useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Card,
  message,
} from "antd";
import { useNavigateWithAuth } from "../../utils/navigate";
import { ROUTES } from "../../constants";
import "./SignUp.css";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader/Loader";

const { Title, Text } = Typography;
const { Content } = Layout;

const SignupPage: React.FC = () => {
  const navigateWithAuth = useNavigateWithAuth();
  const { signUp, loading, isAuthenticated } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [form] = Form.useForm();

  const onFinish = async () => {
    setError(null);
    try {
      const values = form.getFieldsValue();
      await signUp(values);
      message.success("Login successful! Redirecting...");
    } catch (err: any) {
      const messageFromBackend =
        err?.response?.data?.message || err?.message || "Login failed";
      setError(messageFromBackend);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigateWithAuth(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigateWithAuth]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Content className="login-content">
        <Row justify="center" align="middle" className="login-row">
          <Col>
            <Card className="login-card">
              <Title level={2} className="login-title">
                Sign Up
              </Title>
              <Text className="login-subtitle">
                Access your admin panel with creating account.
              </Text>
              <br />
              {error && (
                <Text type="danger" style={{ fontSize: 16 }}>
                  {error}
                </Text>
              )}
              <Form
                form={form}
                layout="vertical"
                onFinish={() => onFinish()}
                className="login-form"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter your email"
                    className="login-input"
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                  ]}
                >
                  <Input.Password
                    size="large"
                    placeholder="Enter your password"
                    className="login-input"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    size="large"
                    htmlType="submit"
                    className="btn primary"
                    block
                  >
                    Sign Up
                  </Button>
                </Form.Item>
                <div className="login-links">
                  <Text>
                    Already have account?{" "}
                    <a onClick={() => navigateWithAuth(ROUTES.LOGIN)}>Login</a>
                  </Text>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default SignupPage;
