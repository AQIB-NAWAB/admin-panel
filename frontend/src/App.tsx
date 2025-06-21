import React from "react";
import { Layout } from "antd";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header";
import AppRouter from "./routes/AppRouter";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Layout>
        <Header />
        <AppRouter />
      </Layout>
    </AuthProvider>
  );
};

export default App;
