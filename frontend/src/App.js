// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home'; // Importar la Home Page
import RegistroCliente from './pages/register/RegistroCliente'; // Importar el componente de registro de clientes
import LoginCliente from './pages/login/LoginCliente'; // Importar el componente de login de clientes
import ProtectedRoute from './components/common/ProtectedRoute'; // Importar componente de proteccion de ruta
import DashboardCliente from './pages/dashboard/DashboardCliente'; // Importar el Dashboard del cliente
import PerfilCliente from './components/perfil/PerfilCliente'; // Importar el componente de Perfil

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
      <Footer />
    </Router>
  );
}

export default App;