// src/pages/dashboard/DashboardCliente.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
// Importamos la función desde api.js
import { obtenerDatosCliente } from '../../services/api';

// Función auxiliar para formatear la fecha
const formatearFecha = (fecha) => {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-ES', opciones);
};

function DashboardCliente() {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llamamos a la función obtenerDatosCliente de api.js
        const data = await obtenerDatosCliente();
        setCliente(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener datos del cliente:', err);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        setLoading(false);

        // Si el error es de autenticación, redirigimos al login
        if (err === 'Error al obtener datos del cliente' || err === 'No autorizado') {
          sessionStorage.clear();
          navigate('/login-usuario');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login-usuario');
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Cargando datos del perfil...</Alert>
      </Container>
    );
  }

  if (error) {
    return <div>Error al cargar el dashboard del cliente: {error}</div>;
  }

  return (
    <section
      className="dashboard-clientes-section py-5"
      style={{
        backgroundColor: '#141414',
        color: '#fff',
        minHeight: '50vh',
        marginTop: '0px'
      }}
    >
      <Container>
        <h1 className="text-center mb-5" style={{ color: '#fff', fontWeight: 'bold' }}>
          Bienvenido al Dashboard de Clientes
        </h1>

        {/* Mostrar los datos del cliente si están disponibles */}
        {cliente && (
          <div className="mb-4 text-center" style={{ color: '#fff' }}>
            <h2>{cliente.primer_nombre} {cliente.primer_apellido}, ¡la suerte está de tu lado!</h2>
            <p>Miembro exclusivo desde el {formatearFecha(cliente.fecha_registro)}. ¡Que sigan rodando los dados a tu favor!</p>
          </div>
        )}
        
        <Row className="mb-4">
          <Col md={4} className="mb-4">
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Perfil</Card.Title>
                <Card.Text>
                  Ver y actualizar información personal
                </Card.Text>
                <Button variant="primary px-4 py-2" className="w-100" onClick={() => navigate('/perfil-cliente')}>
                  Acceder
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Historial de Juegos</Card.Title>
                <Card.Text>
                  Consultar el historial de juegos y apuestas
                </Card.Text>
                <Button variant="primary px-4 py-2" className="w-100" onClick={() => navigate('/historial-juegos')}>
                  Acceder
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Promociones</Card.Title>
                <Card.Text>
                  Ver promociones y bonos disponibles
                </Card.Text>
                <Button variant="primary px-4 py-2" className="w-100" onClick={() => navigate('/promociones-cliente')}>
                  Acceder
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={4} className="mb-4">
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Mis Transacciones</Card.Title>
                <Card.Text>
                  Ver el historial de transacciones y pagos
                </Card.Text>
                <Button variant="primary px-4 py-2" className="w-100" onClick={() => navigate('/transacciones-cliente')}>
                  Acceder
                </Button>
              </Card.Body>
            </Card>

          </Col>

          <Col md={4} className="mb-4">
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Soporte</Card.Title>
                <Card.Text>
                  Contactar al soporte técnico o atención al cliente
                </Card.Text>
                <Button variant="primary px-4 py-2" className="w-100" onClick={() => navigate('/soporte-cliente')}>
                  Acceder
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Cerrar Sesión</Card.Title>
                <Card.Text>
                  Cerrar tu sesión actual
                </Card.Text>
                <Button variant="danger px-4 py-2" className="w-100" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default DashboardCliente;