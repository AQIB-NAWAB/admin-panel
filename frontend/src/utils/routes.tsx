import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants";

interface RouteWrapperProps {
  component: React.ComponentType;
  isProtected: boolean;
}

export const RouteWrapper = ({
  component: Component,
  isProtected,
}: RouteWrapperProps) => {
  const { isAuthenticated } = useAuth();



  if (isProtected && !isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Component />;
};

export const getCurrentRoute = (path: string): string => {
  const route = Object.values(ROUTES).find((route) => route === path);
  return route || ROUTES.HOME;
};
