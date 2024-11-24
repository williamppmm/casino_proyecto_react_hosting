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
import Politicas from './pages/legal/Politicas';
import TerminosCondiciones from './pages/legal/TerminosCondiciones';
import AvisoPrivacidad from './pages/legal/AvisoPrivacidad';
import JuegoResponsable from './pages/legal/JuegoResponsable';
import LoginUsuario from './pages/login/LoginUsuario';
import RegistroUsuario from './pages/register/RegistroUsuario';
import DashboardCliente from './pages/dashboard/DashboardCliente';
import PerfilCliente from './components/profile/PerfilCliente'; 
import ActualizarDatos from './components/profile/ActualizarDatos';
import DashboardAdmin from './pages/dashboard/DashboardAdmin';
import DashboardFinanciero from './pages/dashboard/DashboardFinanciero';
import DashboardSlots from './pages/dashboard/DashboardSlots';
import DashboardSportsBetting from './pages/dashboard/DashboardSportsBetting';
import DashboardMarketing from './pages/dashboard/DashboardMarketing';
import DashboardOnlineGames from './pages/dashboard/DashboardOnlineGames';
import DashboardCashier from './pages/dashboard/DashboardCashier';
import DashboardRestaurant from './pages/dashboard/DashboardRestaurant';
import ProtectedRoute from './components/common/ProtectedRoute';
import RecuperarContrasena from "./pages/login/RecuperarContrasena";
import ResetearContrasena from './pages/login/ResetearContrasena';

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
          <Route path="/politicas" element={<Politicas />} />
          <Route path="/terminos" element={<TerminosCondiciones />} />
          <Route path="/privacidad" element={<AvisoPrivacidad />} />
          <Route path="/juego-responsable" element={<JuegoResponsable />} />
          <Route path="/registro-usuario" element={<RegistroUsuario />} />
          <Route path="/login-usuario" element={<LoginUsuario />} />
          <Route path="/recuperar-password" element={<RecuperarContrasena />} />
          <Route path="/resetear-contrasena" element={<ResetearContrasena />} />
          
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
          <Route
            path="/actualizar-datos"
            element={
              <ProtectedRoute>
                <ActualizarDatos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial-dashboard"
            element={
              <ProtectedRoute>
                <DashboardFinanciero />
              </ProtectedRoute>
            }
          />
          <Route
            path="/slot-machines-dashboard"
            element={
              <ProtectedRoute>
                <DashboardSlots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sports-betting-dashboard"
            element={
              <ProtectedRoute>
                <DashboardSportsBetting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketing-dashboard"
            element={
              <ProtectedRoute>
                <DashboardMarketing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/online-games-dashboard"
            element={
              <ProtectedRoute>
                <DashboardOnlineGames />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cashier-dashboard"
            element={
              <ProtectedRoute>
                <DashboardCashier />
              </ProtectedRoute>
            }
          />
          <Route
            path="/restaurant-dashboard"
            element={
              <ProtectedRoute>
                <DashboardRestaurant />
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