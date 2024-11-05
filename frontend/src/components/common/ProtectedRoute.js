// src/components/common/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = sessionStorage.getItem('token');

  if (!token) {
    // Guardar la ruta actual para redirección posterior
    sessionStorage.setItem('redirectTo', location.pathname);
    return <Navigate to="/login-usuario" replace />;
  }

  // Si hay token válido, renderizar el componente hijo
  return children;
}

export default ProtectedRoute;