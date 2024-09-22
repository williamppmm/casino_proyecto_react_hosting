// src/components/common/Footer.js

// Importaciones necesarias
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import FacebookIcon from '../../assets/icons/Facebook.svg';
import InstagramIcon from '../../assets/icons/Instagram.svg';
import LinkedInIcon from '../../assets/icons/LinkedIn.svg';
import TwitterIcon from '../../assets/icons/Twitter.svg';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-white py-4">
      <Container>
        <Row className="justify-content-center">
          {/* Columna 1: Logo y Derechos Reservados */}
          <Col md={4} className="text-center mb-3">
            <img
              src={require('../../assets/logos/logo.png')}
              alt="Logo Casino La Fortuna"
              width="50"
              height="50"
            />
            <h5 className="mt-2">Casino La Fortuna</h5>
            <p>© 2024 Derechos reservados</p>
            <p>Diseñado por CaliByte</p>
            <p>
              <a href="mailto:info@calibyte.com.co" className="text-light">
                info@calibyte.com.co
              </a>
            </p>
          </Col>

          {/* Columna 2: Redes Sociales */}
          <Col md={4} className="text-center mb-3">
            <h5>Síguenos en</h5>
            <div className="d-flex justify-content-center">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                <img src={FacebookIcon} alt="Facebook" width="30" height="30" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                <img src={InstagramIcon} alt="Instagram" width="30" height="30" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                <img src={LinkedInIcon} alt="LinkedIn" width="30" height="30" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2">
                <img src={TwitterIcon} alt="Twitter" width="30" height="30" />
              </a>
            </div>
          </Col>

          {/* Columna 3: Enlaces Legales */}
          <Col md={4} className="text-center mb-3">
            <h5>Legales</h5>
            <ul className="list-unstyled">
              <li><Link to="/politicas" className="text-light">Políticas</Link></li>
              <li><Link to="/terminos" className="text-light">Términos y Condiciones</Link></li>
              <li><Link to="/privacidad" className="text-light">Aviso de Privacidad</Link></li>
              <li><Link to="/juego-responsable" className="text-light">Juego Responsable</Link></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;