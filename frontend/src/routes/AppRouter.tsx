import React from "react";
import { Routes, Route } from "react-router-dom";
import { RouteWrapper } from "../utils/routes";
import { ROUTES } from "../constants";
import { isProtectedRoute } from "../utils";

const Home = React.lazy(() => import("../pages/Home/Home"));
const Login = React.lazy(() => import("../pages/Login/Login"));
const Signup = React.lazy(() => import("../pages/SignUp/Signup"));
const NotFoundPage = React.lazy(() => import("../pages/NotFound/NotFoundPage"));

const AppRouter = () => {
  const routes = [
    {
      path: ROUTES.HOME,
      component: Home,
      isProtected: isProtectedRoute(ROUTES.HOME),
    },
    {
      path: ROUTES.LOGIN,
      component: Login,
      isProtected: isProtectedRoute(ROUTES.LOGIN),
    },
    {
      path: ROUTES.SIGNUP,
      component: Signup,
      isProtected: isProtectedRoute(ROUTES.LOGIN),
    },
    {
      path: "*",
      component: NotFoundPage,
      isProtected: false,
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
            isProtected={route.isProtected}
          />
        }
      />
    ));
  };

  return <Routes>{renderRoutes()}</Routes>;
};

export default AppRouter;
