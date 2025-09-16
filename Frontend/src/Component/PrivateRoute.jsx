import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function PrivateRoute({ allowedRoles }) {
  const token = JSON.parse(localStorage.getItem('token'));
  let user = null;
  if (token) {
    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(atob(token.split('.')[1]));
      user = payload;
    } catch (e) {
      user = null;
    }
  }
  const location = useLocation();
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
} 