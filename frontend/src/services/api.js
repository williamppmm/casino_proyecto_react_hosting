// src/services/api.js

import axios from 'axios';

// Obtener la URL del backend desde las variables de entorno
const backendUrl = process.env.REACT_APP_BACKEND_URL;

if (!backendUrl) {
  console.error('REACT_APP_BACKEND_URL no está definida en el archivo .env');
}

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: backendUrl,
});

// Agregar log para verificar la URL del backend
console.log('REACT_APP_BACKEND_URL:', backendUrl);

// Función para registrar un usuario general, que usa el endpoint único de registro
export const registrarUsuario = async (datosParaEnviar) => {
  try {
    const response = await api.post('/api/registro-usuario', datosParaEnviar);
    return response.data;
  } catch (error) {
    console.error(`Error en registrarUsuario (POST /api/registro-usuario): ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    throw error.response?.data?.error || "Error en el registro";
  }
};

// Función para verificar el código de autorización
export const verificarCodigoAutorizacion = async (codigo) => {
  try {
    const response = await api.get(`/api/verificar-autorizacion/${codigo}`);
    return response.data; // Asume que retorna datos de la seccion, dashboard, etc.
  } catch (error) {
    console.error(`Error en verificarCodigoAutorizacion: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    throw error.response?.data?.error || "Error al verificar el código de autorización";
  }
};

// Función para el inicio de sesión
export const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login-usuario', credentials);
    return response.data;
  } catch (error) {
    console.error(`Error en login (POST /api/auth/login-usuario): ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    throw error.response?.data?.error || "Error en el inicio de sesión";
  }
};

export default api;