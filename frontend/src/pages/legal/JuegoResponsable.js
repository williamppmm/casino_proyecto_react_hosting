import React from 'react';
import { Container, Card, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/logos/logo.png';

const JuegoResponsable = () => {
  return (
    <div
      style={{
        backgroundColor: '#000',
        minHeight: '100vh',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      <Container>
        <Card style={{ backgroundColor: '#141414' }} className="shadow">
          <Card.Body className="p-4 p-md-5">
            {/* Logo */}
            <div className="text-center mb-4">
              <img
                src={logo || 'placeholder.jpg'}
                alt="Casino La Fortuna"
                className="img-fluid"
                style={{ maxWidth: '180px' }}
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>

            <h1 className="text-center text-light mb-5">Juego Responsable</h1>

            {/* Alert */}
            <Alert variant="primary" className="mb-4">
              <i className="fas fa-info-circle"></i> En Casino La Fortuna, nos comprometemos a promover un ambiente de juego seguro y responsable.
            </Alert>

            {/* Nuestro Compromiso */}
            <section className="mb-5" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h3 className="text-primary mb-3">1. Nuestro Compromiso</h3>
              <p className="text-light">
                Casino La Fortuna está comprometido con proporcionar un entorno de juego seguro y responsable.
                Implementamos diversas medidas y herramientas para ayudar a nuestros usuarios a mantener el control 
                de sus actividades de juego.
              </p>
            </section>

            {/* Señales de Advertencia */}
            <section className="mb-5">
              <h3 className="text-primary mb-3">2. Señales de Advertencia</h3>
              <p className="text-light mb-3">Es importante reconocer las señales que pueden indicar un problema con el juego:</p>
              <ul className="text-light ps-4">
                <li className="mb-2">Jugar con dinero destinado a necesidades básicas</li>
                <li className="mb-2">Aumentar progresivamente el tiempo dedicado al juego</li>
                <li className="mb-2">Intentar recuperar pérdidas jugando más</li>
                <li className="mb-2">Mentir sobre el tiempo o dinero gastado en el juego</li>
                <li className="mb-2">Descuidar responsabilidades laborales o familiares por jugar</li>
                <li className="mb-2">Pedir dinero prestado para jugar</li>
              </ul>
            </section>

            {/* Líneas de Ayuda */}
            <section className="mb-5">
              <h3 className="text-primary mb-3">6. Líneas de Ayuda</h3>
              <p className="text-light mb-3">Si tú o alguien cercano necesita ayuda, estas son las líneas de apoyo disponibles:</p>
              <ul className="list-unstyled text-light ps-4">
                <li className="mb-2">
                  🏥 Línea Nacional de Adicciones: <a href="tel:018000123123" className="text-primary"><strong>01 8000 123 123</strong></a>
                </li>
                <li className="mb-2">
                  📞 Atención 24/7: <a href="tel:+573152728882" className="text-primary"><strong>+57 315 272 8882</strong></a>
                </li>
                <li className="mb-2">
                  💬 Chat de Ayuda: <Link to="/ayuda" className="text-primary">Centro de Ayuda</Link>
                </li>
              </ul>
            </section>

            {/* Footer */}
            <Row className="mt-5">
              <Col className="text-center">
                <p className="text-secondary small">
                  Última actualización: Noviembre 2024
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/" className="btn btn-outline-primary">
                    Volver al inicio
                  </Link>
                  <Link to="/contacto" className="btn btn-primary">
                    Solicitar Ayuda
                  </Link>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default JuegoResponsable;