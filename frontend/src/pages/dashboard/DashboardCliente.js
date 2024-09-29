// src/pages/Dashboard/DashboardCliente.js

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';


// Función auxiliar para formatear la fecha
const formatearFecha = (fecha) => {
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-ES', opciones);
};

function DashboardCliente() {
  const [cliente, setCliente] = useState(null); // Estado para almacenar los datos del cliente
  const [loading, setLoading] = useState(true); // Indicador de carga mientras se obtienen los datos
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate();

  useEffect(() => {
    // Función para obtener los datos del cliente
    const fetchClienteData = async () => {
      const token = localStorage.getItem('token'); // Obtener el token JWT almacenado
      const clienteInfo = JSON.parse(localStorage.getItem('clienteInfo')); // Obtener la info del cliente desde localStorage

      // Si no hay token o información del cliente, redirigir al login
      if (!token || !clienteInfo) {
        navigate('/login-cliente');
        return;
      }

      // Establecer los datos del cliente desde localStorage de inmediato
      setCliente(clienteInfo);
      setLoading(false); // Dejar de mostrar la carga al haber cargado los datos iniciales

      try {
        console.log('Haciendo solicitud al backend para obtener datos actualizados del cliente...');
        console.log(`URL del backend: ${process.env.REACT_APP_BACKEND_URL}/api/clientes/dashboard/${clienteInfo.id_cliente}`);

        // Llamar al backend para obtener datos actualizados del cliente
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/clientes/dashboard/${clienteInfo.id_cliente}`,
          {
            headers: { Authorization: `${token}` } // Enviar el token JWT en los encabezados
          }
        );

        // Actualizar el estado con los datos más recientes del servidor
        console.log('Datos actualizados del cliente recibidos:', response.data);
        setCliente(response.data);
      } catch (error) {
        console.error('Error al obtener los datos actualizados del cliente:', error);
        setError(error); // Guardar el error en el estado

        // Si el token ha expirado o es inválido, redirigir al login
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login-cliente');
        }
      }
    };

    fetchClienteData(); // Ejecutar la función para obtener los datos
  }, [navigate]);

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <div>Cargando datos del cliente...</div>;
  }

  // Mostrar el error si existe
  if (error) {
    return <div>Error al cargar el dashboard del cliente: {error.message}</div>;
  }

  return (
    <section
      className="dashboard-clientes-section py-5"
      style={{
        backgroundColor: '#000',
        color: '#fff',
        minHeight: '100vh',
        paddingTop: '80px', // Ajuste para evitar que el contenido quede oculto
      }}
    >
      <Container>
        <h1 className="text-center mb-5" style={{ color: '#fff', fontWeight: 'bold' }}>
          Bienvenido al Dashboard de Clientes
        </h1>

        {/* Mostrar los datos del cliente si están disponibles */}
        {cliente && (
          <div className="mb-4 text-center" style={{ color: '#fff' }}>
            <h2>{cliente.primer_nombre} {cliente.primer_apellido}, la suerte está de tu lado!</h2>
            <p>Miembro exclusivo desde el {formatearFecha(cliente.fecha_registro)}. ¡Que sigan rodando los dados a tu favor!</p>
          </div>
        )}
        
        <Row className="mb-4">
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Perfil</Card.Title>
                <Card.Text>
                  Ver y actualizar información personal
                </Card.Text>
                <Button variant="primary" className="w-100" onClick={() => navigate('/perfil-cliente')}>
                  Acceder
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Historial de Juegos</Card.Title>
                <Card.Text>
                  Consultar el historial de juegos y apuestas
                </Card.Text>
                <Button variant="primary" className="w-100" onClick={() => navigate('/historial-juegos')}>
                  Acceder
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Promociones</Card.Title>
                <Card.Text>
                  Ver promociones y bonos disponibles
                </Card.Text>
                <Button variant="primary" className="w-100" onClick={() => navigate('/promociones')}>
                  Acceder
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Mis Transacciones</Card.Title>
                <Card.Text>
                  Ver el historial de transacciones y pagos
                </Card.Text>
                <Button variant="primary" className="w-100" onClick={() => navigate('/transacciones-clientes')}>
                  Acceder
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Soporte</Card.Title>
                <Card.Text>
                  Contactar al soporte técnico o atención al cliente
                </Card.Text>
                <Button variant="primary" className="w-100" onClick={() => navigate('/soporte')}>
                  Acceder
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Cerrar Sesión</Card.Title>
                <Card.Text>
                  Cerrar tu sesión actual
                </Card.Text>
                <Button variant="danger" className="w-100" onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('clienteInfo');
                  navigate('/login-cliente');
                }}>
                  Cerrar Sesión
                </Button>
              </Card.Body>
              <p className="text-light">
                <Link to="/dashboard-cliente" className="text-secondary">Volver al Dashboard</Link>
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default DashboardCliente;