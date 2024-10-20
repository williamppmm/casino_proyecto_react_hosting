// src/components/common/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirigir al login si no hay token - se debe cambiar la logica porque el login redirige dependiendo si es cliente operador y el respectivo rol
    return <Navigate to="/login-usuario" replace />;
  }

  return children;
};

export default ProtectedRoute;