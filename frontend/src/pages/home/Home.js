// src/pages/home/Home.js

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import WhatsAppButton from '../../components/common/WhatsAppButton';
import './Home.css'; // Opcional para futuros estilos personalizados

// Importa el logo desde la carpeta assets
import logo from '../../assets/logos/logo.png';

const Home = () => {
  return (
    <Container fluid className="home-page text-center d-flex align-items-center justify-content-center">
      <Row>
        <Col>
          {/* Sección del logo */}
          <img src={logo} alt="Casino La Fortuna" className="logo-img mb-4" />

          {/* Título */}
          <h1 className="mb-4">¡Bienvenido a Casino La Fortuna!</h1>

          {/* Botones interactivos */}
          <div className="mb-4">
            <Button href="/register" variant="primary" size="lg" className="mx-2">
              Registrarse
            </Button>
            <Button href="/login" variant="secondary" size="lg" className="mx-2">
              Iniciar Sesión
            </Button>
          </div>
          
          <div>
            <WhatsAppButton />
          </div>

          {/* Sección de promociones */}
          <h4 className="mb-3">¡No te pierdas nuestras promociones exclusivas!</h4>
          <Button href="/promotions" variant="outline-primary" size="lg">
            Ver Promociones
          </Button>
        </Col>
      </Row>
    </Container>
    
  );
};

export default Home;