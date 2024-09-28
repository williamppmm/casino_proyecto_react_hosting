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

// Función para hacer login
export const loginCliente = async (correo_electronico, user_pass) => {
  try {
    const response = await api.post('/api/clientes/login-cliente', {
      correo_electronico,
      user_pass,
    });
    
    // Almacenar el token en el almacenamiento local si el login es exitoso
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    // Mejor manejo de errores
    console.error(`Error en loginCliente (POST /api/clientes/login-cliente): ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    throw error.response?.data?.error || "Error al iniciar sesión";
  }
};

// Función para registrar un cliente
export const registerCliente = async (datosParaEnviar) => {
  try {
    const response = await api.post('/api/clientes/registro-cliente', datosParaEnviar);
    return response.data;
  } catch (error) {
    console.error(`Error en registerCliente (POST /api/clientes/registro-cliente): ${error.response?.status} - ${error.response?.data?.error || error.message}`);
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

// Cambiar contraseña
export const cambiarContrasena = async (id, contrasenaActual, nuevaContrasena) => {
  try {
    const response = await api.put(`/api/clientes/cambiar-contrasena/${id}`, {
      contrasena_actual: contrasenaActual,
      nueva_contrasena: nuevaContrasena
    });
    return response.data;
  } catch (error) {
    console.error(`Error en cambiarContrasena (PUT /api/clientes/cambiar-contrasena/${id}):`, error.response?.data || error.message);
    throw error.response?.data?.error || "Error al cambiar la contraseña";
  }
};

// Cambiar correo electrónico
export const cambiarCorreo = async (id, currentEmail, newEmail, password) => {
  try {
    const response = await api.put(`/api/clientes/cambiar-correo/${id}`, {
      currentEmail,
      newEmail,
      password
    });
    
    // Actualizar el token en el almacenamiento local si se recibe un nuevo token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error en cambiarCorreo (PUT /api/clientes/cambiar-correo/${id}):`, error.response?.data || error.message);
    throw error.response?.data?.error || "Error al cambiar el correo electrónico";
  }
};

// Dar de baja la cuenta
export const darDeBaja = async (id, email, password) => {
  try {
    const response = await api.delete(`/api/clientes/darse-de-baja/${id}`, {
      data: { email, password }
    });

    // Si la cuenta se da de baja correctamente, eliminamos el token
    if (response.data.message === 'Cuenta dada de baja correctamente') {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }

    return response.data;
  } catch (error) {
    console.error(
      `Error en darDeBaja (DELETE /api/clientes/darse-de-baja/${id}):`,
      error.response?.data || error.message
    );
    throw error.response?.data?.error || "Error al dar de baja la cuenta";
  }
};

// Función para actualizar los datos personales del cliente
export const actualizarDatosCliente = async (id, datos) => {
  try {
    const response = await api.put(`/api/clientes/actualizar-datos/${id}`, datos);
    return response.data;
  } catch (error) {
    console.error(`Error en actualizarDatosCliente (PUT /api/clientes/actualizar-datos/${id}):`, error.response?.data || error.message);
    throw error.response?.data?.error || "Error al actualizar los datos del cliente";
  }
};
// **Interceptor de respuesta eliminado temporalmente**

export default api;