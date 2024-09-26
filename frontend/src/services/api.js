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

// Función para hacer login
export const loginCliente = async (correo_electronico, user_pass) => {
  try {
    const response = await api.post('/api/clientes/login-cliente', {
      correo_electronico,
      user_pass,
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error en loginCliente:', error);
    throw error.response?.data?.error || "Error al iniciar sesión";
  }
};

// Función para registrar un cliente
export const registerCliente = async (datosParaEnviar) => {
  try {
    const response = await api.post('/api/clientes/registro-cliente', datosParaEnviar);
    return response.data;
  } catch (error) {
    console.error('Error en registerCliente:', error);
    throw error.response?.data?.error || "Error en el registro";
  }
};

// Función para cerrar sesión
export const logoutCliente = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// **Interceptor de respuesta eliminado temporalmente**

export default api;