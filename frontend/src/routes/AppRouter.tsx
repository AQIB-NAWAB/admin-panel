import React from "react";
import { Routes, Route } from "react-router-dom";
import { RouteWrapper } from "../utils/routes";
import { ROUTES } from "../constants";
import { isProtectedRoute } from "../utils";

const HomePage = React.lazy(() => import("../pages/Home/HomePage"));
const LoginPage = React.lazy(() => import("../pages/Login/LoginPage"));
const SignupPage = React.lazy(() => import("../pages/SignUp/SignupPage"));
const NotFoundPage = React.lazy(() => import("../pages/NotFound/NotFoundPage"));
const DashboardPage = React.lazy(
  () => import("../pages/Dashboard/DashboardPage")
);
const DemoPage = React.lazy(() => import("../pages/Demo/DemoPage"));
const ProductsPage = React.lazy(() => import("../pages/Products/ProductsPage"));
const LogoutPage = React.lazy(() => import("../pages/Logout/LogoutPage"));

const AppRouter = () => {
  const routes = [
    {
      path: ROUTES.HOME,
      component: HomePage,
    },
    {
      path: ROUTES.LOGIN,
      component: LoginPage,
    },
    {
      path: ROUTES.SIGNUP,
      component: SignupPage,
    },
    {
      path: ROUTES.DASHBOARD,
      component: DashboardPage,
    },
    {
      path: ROUTES.DEMO,
      component: DemoPage,
    },
    {
      path: ROUTES.PRODUCTS,
      component: ProductsPage,
    },
    {
      path: ROUTES.LOGOUT,
      component: LogoutPage,
    },
    {
      path: "*",
      component: NotFoundPage,
    },
  ];

  const renderRoutes = () => {
    return routes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={
          <RouteWrapper
            component={route.component}
            isProtected={isProtectedRoute(route.path)}
          />
        }
      />
    ));
  };

  return <Routes>{renderRoutes()}</Routes>;
};

export default AppRouter;
