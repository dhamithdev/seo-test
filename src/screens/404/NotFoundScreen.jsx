import React, { useEffect } from "react";
import "./notFoundScreen.css";

import { Link } from "react-router-dom";

function NotFoundScreen() {
  useEffect(() => {
    document.title = "Page Not Found";
  }, []);

  return (
    <div className="NotFoundScreen">
      <h1>404</h1>

      <h2>Page Not Found</h2>

      <Link to="/" className="NoLink mybtn nfs-GoBack">
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFoundScreen;
