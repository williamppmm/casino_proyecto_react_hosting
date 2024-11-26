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
          {/* Título */}
          <h1 className="mb-4">¡Bienvenido a Casino La Fortuna!</h1>
          
          {/* Logo con animación de rotación */}
          <div className="logo-container mb-4">
            <img 
              src={logo} 
              alt="Casino La Fortuna" 
              className="logo-spin"
            />
          </div>

          {/* Botones interactivos */}
          <div className="mb-4">
            <Button 
              onClick={() => navigate('/registro-usuario')} 
              variant="primary" 
              size="lg" 
              className="mx-2"
            >
              Registrarse
            </Button>
            <Button 
              onClick={() => navigate('/login-usuario')} 
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
          <h4 className="mb-3">¡Una Experiencia de Juego Inigualable!</h4>
          <Link to="/promociones" className="btn btn-outline-primary btn-lg">
            Ver Promociones
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;