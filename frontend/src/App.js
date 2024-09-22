// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home'; // Importar la Home Page
import CustomNavbar from './components/common/Navbar'; // Importar la Navbar
import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        {/* Definir la ruta de la Home */}
        <Route path="/" element={<Home />} />
        {/* Aquí agregarás las rutas para login, registro y promociones */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;