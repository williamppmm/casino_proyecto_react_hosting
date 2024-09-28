// src/components/common/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirigir al login si no hay token
    return <Navigate to="/login-cliente" replace />;
  }

  return children;
};

export default ProtectedRoute;