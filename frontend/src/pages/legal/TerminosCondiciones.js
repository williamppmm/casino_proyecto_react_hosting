import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/logos/logo.png'; 

const TerminosCondiciones = () => {
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
            {/* Logo con Manejo de Errores */}
            <div className="text-center mb-4">
              <img
                src={logo || 'placeholder.jpg'} // Usar 'placeholder.jpg' en caso de que 'logo' no esté disponible
                alt="Casino La Fortuna"
                className="img-fluid"
                style={{ maxWidth: '180px' }}
                onError={(e) => {
                  console.error('Error cargando el logo:', e);
                  e.target.style.display = 'none'; // Esconder la imagen si ocurre un error
                }}
              />
            </div>

            <h1 className="text-center text-light mb-5">Términos y Condiciones</h1>

            {/* Introducción */}
            <section className="mb-5">
              <h3 className="text-primary mb-3">1. Introducción</h3>
              <p className="text-light">
                Este documento establece los términos y condiciones de uso del software Casino La Fortuna. 
                Al acceder o utilizar este sistema, los usuarios aceptan cumplir con las disposiciones aquí mencionadas. 
                Si no está de acuerdo con alguno de los términos, deberá abstenerse de utilizar el software.
              </p>
            </section>

            {/* Definiciones */}
            <section className="mb-5" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h3 className="text-primary mb-3">2. Definiciones</h3>
              <ul className="text-light ps-4">
                <li className="mb-3">
                  <strong>Software Casino La Fortuna:</strong> Sistema de gestión diseñado para la administración 
                  de operaciones y servicios en casinos.
                </li>
                <li className="mb-3">
                  <strong>Usuario:</strong> Persona que accede al sistema, ya sea cliente, operador o administrador.
                </li>
                <li className="mb-3">
                  <strong>Datos personales:</strong> Información proporcionada por los usuarios, incluyendo datos 
                  de contacto, financieros y de identificación.
                </li>
              </ul>
            </section>

            {/* Uso del Software */}
            <section className="mb-5">
              <h3 className="text-primary mb-3">3. Uso del Software</h3>
              <h4 className="text-light mb-2">3.1. Acceso y Responsabilidades del Usuario</h4>
              <ul className="text-light ps-4">
                <li className="mb-2">El acceso al sistema es personal e intransferible.</li>
                <li className="mb-2">Los usuarios son responsables de mantener la confidencialidad de sus credenciales.</li>
                <li className="mb-2">Queda prohibido el uso del software para fines ilícitos o no autorizados.</li>
              </ul>
            </section>

            {/* Privacidad */}
            <section className="mb-5">
              <h3 className="text-primary mb-3">4. Privacidad y Protección de Datos</h3>
              <p className="text-light">
                Los datos recopilados serán utilizados únicamente para fines relacionados con la operación 
                del casino y la mejora del servicio. Para más información, consulte nuestra{' '}
                <Link to="/privacidad" className="text-primary">
                  Política de Privacidad
                </Link>.
              </p>
            </section>

            {/* Contacto */}
            <section className="mb-5">
              <h3 className="text-primary mb-3">5. Contacto</h3>
              <p className="text-light mb-2">Para consultas o soporte técnico, contáctenos a través de:</p>
              <ul className="list-unstyled text-light ps-4">
                <li className="mb-2">📧 Email: soporte@casinolafortuna.com</li>
                <li className="mb-2">📞 Teléfono: +57 315 272 8882</li>
              </ul>
            </section>

            {/* Footer */}
            <Row className="mt-5">
              <Col className="text-center">
                <p className="text-secondary small">
                  Última actualización: Noviembre 2024
                </p>
                <Link to="/" className="btn btn-outline-primary">
                  Volver al inicio
                </Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TerminosCondiciones;