// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Estilos personalizados
import App from './App';  // Componente principal de la aplicación
import reportWebVitals from './reportWebVitals';  // Métricas de rendimiento (opcional)
import 'bootstrap/dist/css/bootstrap.min.css';  // Estilos de Bootstrap
// import axios from 'axios';  // Llamadas a la API, en caso de que quieras usar Axios

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si no necesitas reportar el rendimiento, puedes comentar o eliminar esta línea
reportWebVitals();
