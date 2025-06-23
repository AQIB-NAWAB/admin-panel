import { useEffect } from "react";
import Loader from "../../components/Loader/Loader";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants";
import { useNavigateWithAuth } from "../../utils/navigate";

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigateWithAuth();
  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        navigate(ROUTES.HOME);
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
    performLogout();
  }, []);

  return <Loader />;
};

export default LogoutPage;
