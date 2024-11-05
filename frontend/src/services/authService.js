// src/services/authService.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

class AuthService {
  constructor() {
    // Configurar interceptor para manejar errores de autenticación
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login-usuario';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login-usuario`, credentials);
      
      if (response.data.token) {
        this.setSession(response.data);
        this.setAxiosDefaults(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Error en el inicio de sesión';
    }
  }

  logout() {
    sessionStorage.clear();
    this.clearAxiosDefaults();
    window.location.href = '/login-usuario';
  }

  setSession(authData) {
    sessionStorage.setItem('token', authData.token);
    sessionStorage.setItem('user_type', authData.tipo);
    sessionStorage.setItem('user_name', authData.nombre);
    sessionStorage.setItem('dashboard_url', authData.dashboard_url);
  }

  setAxiosDefaults(token) {
    // Enviar el token sin el prefijo Bearer
    axios.defaults.headers.common['Authorization'] = token;
  }

  clearAxiosDefaults() {
    delete axios.defaults.headers.common['Authorization'];
  }

  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: token } : {};
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  getUserType() {
    return sessionStorage.getItem('user_type');
  }

  getDashboardUrl() {
    return sessionStorage.getItem('dashboard_url');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  initializeAuth() {
    const token = this.getToken();
    if (token) {
      this.setAxiosDefaults(token);
    }
  }
}

const authService = new AuthService();
export default authService;