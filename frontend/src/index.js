// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Estilos personalizados
import App from './App';  // Componente principal de la aplicación
import 'bootstrap/dist/css/bootstrap.min.css';  // Estilos de Bootstrap

// Este es el root donde se monta tu aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
