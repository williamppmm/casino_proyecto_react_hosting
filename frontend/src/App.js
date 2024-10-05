// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home'; // Importar la Home Page
import QuienesSomos from './pages/home/QuienesSomos'; // Importar el componente juegos
import NuestrosJuegos from './pages/home/NuestrosJuegos'; // Importar el componente de quienes somos
import Promociones from './pages/home/Promociones'; // Importar el componente de promociones
import Contacto from './pages/home/Contacto'; // Importar el componente de contacto
import RegistroCliente from './pages/register/RegistroCliente'; // Importar el componente de registro de clientes
import LoginCliente from './pages/login/LoginCliente'; // Importar el componente de login de clientes
import ProtectedRoute from './components/common/ProtectedRoute'; // Importar componente de proteccion de ruta
import DashboardCliente from './pages/dashboard/DashboardCliente'; // Importar el Dashboard del cliente
import PerfilCliente from './components/profile/PerfilCliente'; // Importar el componente de Perfil
import ActualizarDatos from './components/profile/ActualizarDatos'; // Importar el componente para actualizar datos no sensibles
import CambiarContrasena from './components/profile/CambiarContrasena'; // Importar el componente para cambiar la contraseña
import CambiarMail from './components/profile/CambiarMail'; // Importar el componente para cambiar el mail
import DarseDeBaja from './components/profile/DarseDeBaja'; // Importar el componente para darse de baja


import CustomNavbar from './components/common/Navbar'; // Importar la Navbar
import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro-cliente" element={<RegistroCliente />} />
        <Route path="/login-cliente" element={<LoginCliente />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/nuestros-juegos" element={<NuestrosJuegos />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/contacto" element={<Contacto />} />
        
        <Route 
          path="/dashboard-cliente" 
          element={
            <ProtectedRoute>
              <DashboardCliente />
            </ProtectedRoute>
          } 
        />
                <Route 
          path="/perfil-cliente" 
          element={
            <ProtectedRoute>
              <PerfilCliente />
            </ProtectedRoute>
          } 
        />
                <Route 
          path="/modificar-informacion" 
          element={
            <ProtectedRoute>
              <ActualizarDatos />
            </ProtectedRoute>
          } 
        />
              <Route 
          path="/cambiar-contrasena" 
          element={
            <ProtectedRoute>
              <CambiarContrasena />
            </ProtectedRoute>
          } 
        />
              <Route 
          path="/cambiar-mail" 
          element={
            <ProtectedRoute>
              <CambiarMail />
            </ProtectedRoute>
          } 
        />
              <Route 
          path="/darse-de-baja" 
          element={
            <ProtectedRoute>
              <DarseDeBaja />
            </ProtectedRoute>
          } 
        />
 
       </Routes>
      <Footer />
    </Router>
  );
}

export default App;