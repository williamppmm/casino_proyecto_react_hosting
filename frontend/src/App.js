// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import CustomNavbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import QuienesSomos from './pages/home/QuienesSomos'
import NuestrosJuegos from './pages/home/NuestrosJuegos'
import Promociones from './pages/home/Promociones'
import Contacto from './pages/home/Contacto'
import RegistroUsuario from './pages/register/RegistroUsuario'

function App() {
  return (
    <>
      <CustomNavbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quienes-somos" element={<QuienesSomos />} />
        <Route path="/nuestros-juegos" element={<NuestrosJuegos />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/Contacto" element={<Contacto />} />
        <Route path="/registro-usuario" element={<RegistroUsuario />} />
      </Routes>

      <Footer />
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;