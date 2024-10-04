// src/pages/home/QuienesSomos.js

// Importaciones de bibliotecas externas
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Importaciones de assets
import HistoriaImagen from '../../assets/images/IMG_007.png'; // Imagen para "Nuestra Historia"
import MisionImagen from '../../assets/images/IMG_002.png'; // Imagen para "Nuestra Misión"

// Definición del componente funcional QuienesSomos
function QuienesSomos() {
  return (
    <section className="quienes-somos-section py-5" style={{ backgroundColor: '#141414', color: '#fff', minHeight: '65vh', marginTop: '65px' }}>
      <Container>
        {/* Título de la página */}
        <h1 className="text-center mb-5" style={{ color: '#fff', fontWeight: 'bold' }}>Quiénes Somos</h1>

        {/* Contenido dividido en dos columnas con tarjetas */}
        <Row>
          <Col xs={12} md={6}>
            <Card className="bg-dark text-white mb-4">
              <Card.Img src={HistoriaImagen} alt="Nuestra Historia" />
              <Card.ImgOverlay className="d-flex flex-column justify-content-end">
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '15px', borderRadius: '5px' }}>
                  <Card.Title className="text-white">Nuestra Historia</Card.Title>
                  <Card.Text style={{ textAlign: 'justify' }}>
                    Casino La Fortuna nació en 2010 con la visión de crear un espacio de entretenimiento
                    de primer nivel. Desde entonces, hemos crecido para convertirnos en uno de los destinos
                    de juego más emocionantes del país.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/registro-cliente" className="me-2">Regístrate</Button>
                </div>
              </Card.ImgOverlay>
            </Card>
          </Col>

          <Col xs={12} md={6}>
            <Card className="bg-dark text-white mb-4">
              <Card.Img src={MisionImagen} alt="Nuestra Misión" />
              <Card.ImgOverlay className="d-flex flex-column justify-content-end">
                <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: '15px', borderRadius: '5px' }}>
                  <Card.Title className="text-white">Nuestra Misión</Card.Title>
                  <Card.Text style={{ textAlign: 'justify' }}>
                    Nos dedicamos a proporcionar una experiencia de juego inigualable, combinando la
                    emoción del casino tradicional con la comodidad y accesibilidad de la tecnología
                    moderna. Nuestro objetivo es garantizar la diversión y seguridad de todos nuestros
                    clientes.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/juegos">Conoce nuestros juegos</Button>
                </div>
              </Card.ImgOverlay>
            </Card>
          </Col>
        </Row>

        {/* Enlace para clientes existentes */}
        <Row className="text-center mt-4">
          <Col>
            <p className="text-light">
              ¿Ya eres cliente? <Link to="/login-cliente" className="text-primary">Inicia sesión aquí</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

// Exportación del componente para su uso en otras partes de la aplicación
export default QuienesSomos;