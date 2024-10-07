// src/pages/home/Home.js

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import WhatsAppButton from '../../components/common/WhatsAppButton';
import './Home.css';

// Importa el logo desde la carpeta assets
import logo from '../../assets/logos/logo.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container fluid className="home-page text-center d-flex align-items-center justify-content-center">
      <Row>
        <Col>
          {/* Sección del logo */}
          <img src={logo} alt="Casino La Fortuna" className="logo-img mb-4 animate-logo" />

          {/* Título */}
          <h1 className="mb-4">¡Bienvenido a Casino La Fortuna!</h1>

          {/* Botones interactivos */}
          <div className="mb-4">
            <Button 
              onClick={() => navigate('/registro-cliente')} 
              variant="primary" 
              size="lg" 
              className="mx-2"
            >
              Registrarse
            </Button>
            <Button 
              onClick={() => navigate('/login-cliente')} 
              variant="secondary" 
              size="lg" 
              className="mx-2"
            >
              Iniciar Sesión
            </Button>
          </div>
          
          <div>
            <WhatsAppButton />
          </div>

          {/* Sección de promociones */}
          <h4 className="mb-3">¡No te pierdas nuestras promociones exclusivas!</h4>
          <Link to="/promociones" className="btn btn-outline-primary btn-lg">
            Ver Promociones
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;