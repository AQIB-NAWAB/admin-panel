import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader/Loader";
import { ROUTES } from "../constants";

interface RouteWrapperProps {
  component: React.ComponentType;
  isProtected: boolean;
}

export const RouteWrapper = ({
  component: Component,
  isProtected,
}: RouteWrapperProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (isProtected && !isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Component />;
};
