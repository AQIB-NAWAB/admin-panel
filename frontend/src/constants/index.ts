import HeroImg1 from "../assets/images/1.png";
import HeroImg2 from "../assets/images/2.png";
import HeroImg3 from "../assets/images/3.png";

const ProectedRoutes = {
  DASHBOARD: "/dashboard",
  USER: "/user",
  PRODUCTS: "/dashboard/products",
};

const PublicRoutes = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  ABOUT: "/about",
};

const ROUTES = {
  ...ProectedRoutes,
  ...PublicRoutes,
};

export { ProectedRoutes, PublicRoutes, ROUTES };

// Images
export { HeroImg1, HeroImg2, HeroImg3 };
