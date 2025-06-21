import React from "react";
import { useNavigateWithAuth } from "../../utils/navigate";
import "./NotFoundPage.css";
import { ROUTES } from "../../constants";

const NotFound: React.FC = () => {
  const navigate = useNavigateWithAuth();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404 - Page Not Found</h1>
        <p className="not-found-text">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
        <button
          className="not-found-button"
          onClick={() => navigate(ROUTES.HOME)}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;