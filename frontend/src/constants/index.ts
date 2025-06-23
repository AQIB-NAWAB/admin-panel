import HeroImg1 from "../assets/images/1.png";
import HeroImg2 from "../assets/images/2.png";
import HeroImg3 from "../assets/images/3.png";

const ProectedRoutes = {
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
};

const PublicRoutes = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  LOGOUT:"/logout",
};

const ROUTES = {
  ...ProectedRoutes,
  ...PublicRoutes,
};

const OpenSidebarBtnClass = "open-sidebar-btn";

export { ProectedRoutes, PublicRoutes, ROUTES };

// Images
export { HeroImg1, HeroImg2, HeroImg3 };

// Constants for the application
export { OpenSidebarBtnClass };
