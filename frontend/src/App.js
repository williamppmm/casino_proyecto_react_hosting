// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomNavbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/home/Home';
import QuienesSomos from './pages/home/QuienesSomos';
import NuestrosJuegos from './pages/home/NuestrosJuegos';
import Promociones from './pages/home/Promociones';
import Contacto from './pages/home/Contacto';
import LoginUsuario from './pages/login/LoginUsuario';
import RegistroUsuario from './pages/register/RegistroUsuario';
import DashboardCliente from './pages/dashboard/DashboardCliente';
import PerfilCliente from './components/profile/PerfilCliente'; 
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <>
      <CustomNavbar />
      <main style={{ minHeight: '80vh', paddingTop: '60px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/nuestros-juegos" element={<NuestrosJuegos />} />
          <Route path="/promociones" element={<Promociones />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/registro-usuario" element={<RegistroUsuario />} />
          <Route path="/login-usuario" element={<LoginUsuario />} />
          
          {/* Rutas protegidas */}
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
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;