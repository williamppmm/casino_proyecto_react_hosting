// src/services/api.js

import axios from 'axios';

// Obtener la URL del backend desde las variables de entorno
const backendUrl = process.env.REACT_APP_BACKEND_URL;

if (!backendUrl) {
  console.error('REACT_APP_BACKEND_URL no está definida en el archivo .env');
}

// Crear una instancia de axios con la URL base y configuración común
const api = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones autenticadas
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token; 
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Funciones de Autenticación y Registro

export const registrarUsuario = async (datosParaEnviar) => {
  try {
    const response = await api.post('/api/registro/registro-usuario', datosParaEnviar);
    return response.data;
  } catch (error) {
    console.error(`Error en registrarUsuario: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    throw error.response?.data?.error || 'Error en el registro';
  }
};

export const verificarCodigoAutorizacion = async (codigo) => {
  try {
    const response = await api.get(`/api/registro/verificar-autorizacion/${codigo}`);
    return response.data;
  } catch (error) {
    console.error(`Error en verificarCodigoAutorizacion: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    throw error.response?.data?.error || 'Error al verificar el código de autorización';
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login-usuario', credentials);
    return response.data;
  } catch (error) {
    console.error(`Error en login: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    throw error.response?.data?.error || 'Error en el inicio de sesión';
  }
};

// Funciones de Gestión de Perfil

export const obtenerDatosCliente = async () => {
  try {
    const response = await api.get('/api/clientes/datos');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al obtener datos del cliente');
  }
};

export const actualizarDatosCliente = async (datos) => {
  if (!datos || !datos.contrasena) {
    throw new Error('La contraseña es requerida para confirmar los cambios.');
  }
  try {
    const response = await api.put('/api/clientes/actualizar', datos);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al actualizar datos del cliente');
  }
};

export const cambiarContrasena = async (clienteId, datos) => {
  try {
    const response = await api.put(`/api/clientes/cambiar-contrasena/${clienteId}`, datos);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al cambiar la contraseña');
  }
};

export const cambiarCorreo = async (clienteId, datos) => {
  try {
    const response = await api.put(`/api/clientes/cambiar-correo/${clienteId}`, datos);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al cambiar el correo electrónico');
  }
};

export const darseDeBaja = async (clienteId, datos) => {
  try {
    const response = await api.delete(`/api/clientes/darse-de-baja/${clienteId}`, {
      data: datos,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Error al darse de baja');
  }
};

// Función para manejar errores de la API
const handleApiError = (error, defaultMessage) => {
  console.error(`${defaultMessage}:`, error.response?.data || error.message);
  throw error.response?.data?.error || defaultMessage;
};

export default api;