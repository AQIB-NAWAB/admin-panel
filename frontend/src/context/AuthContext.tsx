import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { User } from "../constants/interfaces";
import { config } from "../constants/config";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (userData: Partial<User>) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      // TODO ->> API Serice ( Class , interceptor, error handling )
      const res = await axios.get(`${config.API_URL}/auth/me`, { withCredentials: true });
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      await axios.post(`${config.API_URL}/auth/login`, userData, { withCredentials: true });
      await getCurrentUser();
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${config.API_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const signUp = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      await axios.post(`${config.API_URL}/auth/signup`, userData, { withCredentials: true });
      await getCurrentUser();
    } catch (err) {
      console.error("Signup error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        signUp,
        getCurrentUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
