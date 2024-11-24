// src/components/profile/PerfilCliente.js

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Alert, ListGroup } from 'react-bootstrap';
import { obtenerDatosCliente } from '../../services/api';

const DetallesCliente = ({ cliente }) => (
  <ListGroup variant="flush">
    <ListGroup.Item style={{ backgroundColor: '#141414', color: 'white' }}>
      <strong>Nombre:</strong> {cliente.primer_nombre} {cliente.segundo_nombre} {cliente.primer_apellido} {cliente.segundo_apellido}
    </ListGroup.Item>
    <ListGroup.Item style={{ backgroundColor: '#141414', color: 'white' }}>
      <strong>Correo electrónico:</strong> {cliente.correo_electronico}
    </ListGroup.Item>
    <ListGroup.Item style={{ backgroundColor: '#141414', color: 'white' }}>
      <strong>Teléfono móvil:</strong> {cliente.telefono_movil}
    </ListGroup.Item>
    <ListGroup.Item style={{ backgroundColor: '#141414', color: 'white' }}>
      <strong>Dirección:</strong> {cliente.direccion}
    </ListGroup.Item>
    <ListGroup.Item style={{ backgroundColor: '#141414', color: 'white' }}>
      <strong>Municipio:</strong> {cliente.municipio}
    </ListGroup.Item>
    <ListGroup.Item style={{ backgroundColor: '#141414', color: 'white' }}>
      <strong>Fecha de nacimiento:</strong> {new Date(cliente.fecha_nacimiento).toLocaleDateString()}
    </ListGroup.Item>
    <ListGroup.Item style={{ backgroundColor: '#141414', color: 'white' }}>
      <strong>Nacionalidad:</strong> {cliente.nacionalidad}
    </ListGroup.Item>
    <ListGroup.Item style={{ backgroundColor: '#141414', color: 'white' }}>
      <strong>Tipo de documento:</strong> {cliente.tipo_documento}
    </ListGroup.Item>
    <ListGroup.Item style={{ backgroundColor: '#141414', color: 'white' }}>
      <strong>Número de documento:</strong> {cliente.numero_documento}
    </ListGroup.Item>
    <ListGroup.Item style={{ backgroundColor: '#141414', color: 'white' }}>
      <strong>Lugar de expedición:</strong> {cliente.lugar_expedicion}
    </ListGroup.Item>
    <ListGroup.Item style={{ backgroundColor: '#141414', color: 'white' }}>
      <strong>Fecha de expedición:</strong> {new Date(cliente.fecha_expedicion).toLocaleDateString()}
    </ListGroup.Item>
    <ListGroup.Item style={{ backgroundColor: '#141414', color: 'white' }}>
      <strong>Fecha de registro:</strong> {new Date(cliente.fecha_registro).toLocaleDateString()}
    </ListGroup.Item>
  </ListGroup>
);

const PerfilCliente = () => {
  const [clienteData, setClienteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClienteData = async () => {
      try {
        const data = await obtenerDatosCliente();
        setClienteData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener los datos del cliente:', err);
        setError('Error al obtener los datos del cliente. Por favor, intenta nuevamente.');
        setLoading(false);

        if (err.response?.status === 401) {
          sessionStorage.removeItem('token');
          navigate('/login-cliente');
        }
      }
    };

    fetchClienteData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login-cliente');
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Cargando datos del perfil...</Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', minHeight: '80vh', paddingTop: '80px', paddingBottom: '80px', marginTop: '0px' }}>
      <Container style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Tu información</h2>
            {clienteData && <DetallesCliente cliente={clienteData} />}
          </Card.Body>
        </Card>

        <Row className="mt-4">
          <Col md={6} className="mb-4">
            <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
              <Card.Body className="p-3">
                <Card.Title>Modificación de Información No Sensible</Card.Title>
                <Card.Text>Actualiza tu teléfono, dirección y más.</Card.Text>
                <Button variant="primary" onClick={() => navigate('/actualizar-datos')}>
                  Modificar Información
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
              <Card.Body className="p-3">
                <Card.Title>Cambio de Contraseña</Card.Title>
                <Card.Text>Actualiza tu contraseña de forma segura.</Card.Text>
                <Button variant="primary" onClick={() => navigate('/cambiar-contrasena')}>
                  Cambiar Contraseña
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
              <Card.Body className="p-3">
                <Card.Title>Cambio de Correo Electrónico</Card.Title>
                <Card.Text>Actualiza tu correo electrónico.</Card.Text>
                <Button variant="primary" onClick={() => navigate('/cambiar-mail')}>
                  Cambiar Correo Electrónico
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
              <Card.Body className="p-3">
                <Card.Title>Dar de Baja la Cuenta</Card.Title>
                <Card.Text>Elimina tu cuenta permanentemente.</Card.Text>
                <Button variant="danger" onClick={() => navigate('/darse-de-baja')}>
                  Dar de Baja la Cuenta
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="mt-4 text-center">
          <Button variant="btn btn-outline-secondary" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
        <div className="mt-4 text-center">
          <Link to="/dashboard-cliente" className="btn btn-outline-primary">
            Dashboard
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default PerfilCliente;