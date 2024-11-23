import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/logos/logo.png'; 
import { Mail, Phone } from 'lucide-react';

const AvisoPrivacidad = () => {
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

            <h1 className="text-center text-light mb-5">Aviso de Privacidad</h1>

            {/* Información que Recopilamos */}
            <section className="mb-5" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <h3 className="text-primary mb-3">1. Información que Recopilamos</h3>
              <p className="text-light">
                En Casino La Fortuna, recopilamos y tratamos información personal para brindar 
                nuestros servicios de manera eficiente y segura. La información que podemos recopilar incluye:
              </p>
              <ul className="text-light ps-4">
                <li className="mb-2">Datos de identificación personal (nombre, documento de identidad)</li>
                <li className="mb-2">Información de contacto (correo electrónico, teléfono, dirección)</li>
                <li className="mb-2">Datos financieros para procesamiento de pagos</li>
                <li className="mb-2">Historial de juego y transacciones</li>
                <li className="mb-2">Información técnica de acceso al sistema</li>
              </ul>
            </section>

            {/* Uso de la Información */}
            <section className="mb-5">
              <h3 className="text-primary mb-3">2. Uso de la Información</h3>
              <p className="text-light">Utilizamos su información personal para:</p>
              <ul className="text-light ps-4">
                <li className="mb-2">Gestionar su cuenta y proporcionar nuestros servicios</li>
                <li className="mb-2">Procesar transacciones y pagos</li>
                <li className="mb-2">Cumplir con requisitos legales y regulatorios</li>
                <li className="mb-2">Prevenir actividades fraudulentas</li>
                <li className="mb-2">Mejorar nuestros servicios y experiencia del usuario</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3 className="text-primary mb-3">3. Protección de Datos</h3>
              <p className="text-light">
                Implementamos medidas de seguridad técnicas y organizativas para proteger su información:
              </p>
              <ul className="text-light ps-4">
                <li className="mb-2">Encriptación de datos sensibles</li>
                <li className="mb-2">Acceso restringido a información personal</li>
                <li className="mb-2">Monitoreo continuo de seguridad</li>
                <li className="mb-2">Actualización regular de protocolos de seguridad</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3 className="text-primary mb-3">4. Sus Derechos</h3>
              <p className="text-light">
                Como titular de los datos personales, usted tiene derecho a:
              </p>
              <ul className="text-light ps-4">
                <li className="mb-2">Acceder a sus datos personales</li>
                <li className="mb-2">Solicitar la rectificación de datos incorrectos</li>
                <li className="mb-2">Solicitar la eliminación de sus datos</li>
                <li className="mb-2">Oponerse al tratamiento de sus datos</li>
                <li className="mb-2">Presentar una reclamación ante la autoridad de control</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3 className="text-primary mb-3">5. Cookies y Tecnologías Similares</h3>
              <p className="text-light">
                Utilizamos cookies y tecnologías similares para mejorar su experiencia de usuario,
                analizar el uso del sitio y personalizar el contenido. Puede gestionar las preferencias
                de cookies a través de la configuración de su navegador.
              </p>
            </section>

            <section className="mb-4">
              <h3 className="text-primary mb-3">6. Compartir Información</h3>
              <p className="text-light">
                No compartimos su información personal con terceros, excepto cuando:
              </p>
              <ul className="text-light ps-4">
                <li className="mb-2">Sea requerido por ley</li>
                <li className="mb-2">Sea necesario para procesar transacciones</li>
                <li className="mb-2">Tengamos su consentimiento explícito</li>
              </ul>
            </section>

            <section className="mb-4">
              <h3 className="text-primary mb-3">7. Contacto</h3>
              <p className="text-light mb-2">
                Para ejercer sus derechos o realizar consultas sobre privacidad, contáctenos a través de:
              </p>
              <ul className="list-unstyled text-light ps-4">
                <li className="mb-2">
                  <Mail className="inline-block mr-2" size={18} /> 
                  Email: privacidad@casinolafortuna.com
                </li>
                <li className="mb-2">
                  <Phone className="inline-block mr-2" size={18} /> 
                  Teléfono: +57 315 272 8882
                </li>
              </ul>
            </section>

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

export default AvisoPrivacidad;