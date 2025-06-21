import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { isProtectedRoute } from "../utils/index";

export const useNavigateWithAuth = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const navigateWithAuth = useCallback(
    (path: string) => {

        const isValid = isProtectedRoute(path);

      if (isValid && !isAuthenticated) {
        navigate("/login");
        return;
      }
      navigate(path);
    },
    [navigate, isAuthenticated]
  );

  return navigateWithAuth;
};
