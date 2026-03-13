// // src/components/ProtectedRoute.js
// import React, { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const [loading, setLoading] = useState(true);
//   const [isAuth, setIsAuth] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) setIsAuth(true);
//     setLoading(false);
//   }, []);

//   if (loading) return <p>Checking authentication...</p>;

//   return isAuth ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;



import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, fallback = '/auth' }) => {
  const { isAuthenticated, loading, initialized } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading || !initialized) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;