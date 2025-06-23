import { Layout } from "antd";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header";
import AppRouter from "./routes/AppRouter";
import { SidebarProvider } from "./context/SidebarContext";
import DashboardSidebar from "./components/Sidebar/DashboardSidebar/DashboardSideBar";
import { DashboardProvider } from "./context/DashboardContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DashboardProvider>
        <SidebarProvider>
          <Layout>
            <Header />
            <DashboardSidebar />
            <AppRouter />
          </Layout>
        </SidebarProvider>
      </DashboardProvider>
    </AuthProvider>
  );
};

export default App;
