import { ProectedRoutes } from "../constants";

const isAuthRequired = (path: string): boolean => {
  const protectedPaths = Object.values(ProectedRoutes);

  return protectedPaths.some((protectedPath) => path.startsWith(protectedPath));
};
export const isProtectedRoute = (path: string): boolean => {
  return isAuthRequired(path);
};




