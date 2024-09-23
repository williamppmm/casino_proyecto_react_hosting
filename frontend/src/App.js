// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home'; // Importar la Home Page
import RegistroCliente from './pages/register/RegistroCliente'; // Importar el componente de registro de clientes

import CustomNavbar from './components/common/Navbar'; // Importar la Navbar
import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        {/* Definición de la ruta de la Page Home */}
        <Route path="/" element={<Home />} />
        {/* Definición de la ruta para el registro de clientes */}
        <Route path="/registro-cliente" element={<RegistroCliente />} /> 
        {/* Integrar nuevas rutas */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;