import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/logos/logo.png'; // Asegúrate de que esta ruta sea válida

const Politicas = () => {
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

            <h1 className="text-center text-light mb-5">Políticas</h1>

            {/* Políticas de Ingreso */}
            <section className="mb-5" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h3 className="text-primary mb-3">1. Políticas de Ingreso</h3>
              <p className="text-light">
                Para garantizar una experiencia segura y agradable, establecemos las siguientes políticas de ingreso:
              </p>
              <ul className="text-light ps-4">
                <li className="mb-2">Edad mínima de 18 años con documento de identidad válido</li>
                <li className="mb-2">Código de vestimenta formal/casual elegante</li>
                <li className="mb-2">Prohibido el ingreso de armas o elementos peligrosos</li>
                <li className="mb-2">Reserva del derecho de admisión</li>
              </ul>
            </section>

            {/* Políticas de Pago y Transacciones */}
            <section className="mb-5">
              <h3 className="text-primary mb-3">2. Políticas de Pago y Transacciones</h3>
              <div className="text-light">
                <h5 className="mb-2">2.1 Métodos de Pago Aceptados</h5>
                <ul className="ps-4 mb-3">
                  <li>Tarjetas de crédito y débito</li>
                  <li>Transferencias bancarias</li>
                  <li>Pagos en efectivo</li>
                  <li>Billeteras electrónicas autorizadas</li>
                </ul>
                <h5 className="mb-2">2.2 Retiros</h5>
                <ul className="ps-4 mb-3">
                  <li>Verificación de identidad requerida</li>
                  <li>Procesamiento en días hábiles</li>
                  <li>Límites mínimos y máximos según método</li>
                  <li>Misma vía de depósito cuando sea posible</li>
                </ul>
              </div>
            </section>

            {/* Políticas de Seguridad */}
            <section className="mb-5">
              <h3 className="text-primary mb-3">3. Políticas de Seguridad</h3>
              <Row className="text-light">
                <Col md={6} className="mb-3">
                  <h5>Seguridad Física</h5>
                  <ul className="ps-4">
                    <li>Personal de seguridad 24/7</li>
                    <li>Sistemas de videovigilancia</li>
                    <li>Control de acceso</li>
                    <li>Protocolos de emergencia</li>
                  </ul>
                </Col>
                <Col md={6} className="mb-3">
                  <h5>Seguridad Digital</h5>
                  <ul className="ps-4">
                    <li>Encriptación de datos</li>
                    <li>Autenticación de dos factores</li>
                    <li>Monitoreo de transacciones</li>
                    <li>Protección contra fraudes</li>
                  </ul>
                </Col>
              </Row>
            </section>

            {/* Contacto */}
            <section className="mb-5">
              <h3 className="text-primary mb-3">7. Contacto y Soporte</h3>
              <ul className="list-unstyled text-light ps-4">
                <li className="mb-2">
                  📧 Consultas generales: <a href="mailto:info@casinolafortuna.com" className="text-primary">info@casinolafortuna.com</a>
                </li>
                <li className="mb-2">
                  💬 Soporte técnico: <a href="mailto:soporte@casinolafortuna.com" className="text-primary">soporte@casinolafortuna.com</a>
                </li>
                <li className="mb-2">
                  📞 Línea de atención: <a href="tel:+573152728882" className="text-primary">+57 315 272 8882</a>
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
                    Contactar Soporte
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

export default Politicas;