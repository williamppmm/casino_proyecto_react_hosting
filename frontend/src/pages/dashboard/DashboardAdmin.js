// src/pages/dashboard/DashboardAdmin.js

import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

function DashboardAdmin() {
  const [statsData] = useState({
    ingresosDiarios: [
      { fecha: '14-03', ingresos: 2500000 },
      { fecha: '15-03', ingresos: 3200000 },
      { fecha: '16-03', ingresos: 2800000 },
      { fecha: '17-03', ingresos: 3500000 },
      { fecha: '18-03', ingresos: 3100000 },
    ],
    inventarioAlertas: [
      { item: 'Fichas $1000', stock: 150, minimo: 200 },
      { item: 'Fichas $5000', stock: 80, minimo: 100 },
      { item: 'Bebidas', stock: 45, minimo: 50 },
    ],
    personalStats: [
      { area: 'Tragamonedas', personal: 12, asistencia: 95 },
      { area: 'Mesas', personal: 8, asistencia: 90 },
      { area: 'Bar', personal: 5, asistencia: 88 },
    ],
    juegosStats: [
      { juego: 'Tragamonedas 1', uso: 85 },
      { juego: 'Poker', uso: 75 },
      { juego: 'Ruleta', uso: 90 },
      { juego: 'Blackjack', uso: 70 },
    ],
    ultimasTransacciones: [
      { fecha: '16-03-2024', descripcion: 'Pago de Premios', monto: 650000 },
      { fecha: '15-03-2024', descripcion: 'Compra de Fichas', monto: 1000000 },
      { fecha: '14-03-2024', descripcion: 'Pago a Proveedores', monto: 150000 },
    ],
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <section style={{ backgroundColor: '#141414', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container fluid className="p-4">
        <h1 className="text-center text-white mb-4">Dashboard Administrativo</h1>

        {/* Primera fila de tarjetas */}
        <Row className="mb-4">
          <Col md={6} lg={3}>
            <Card bg="primary" text="white" className="mb-4">
              <Card.Body>
                <Card.Title>Total Ingresos Hoy</Card.Title>
                <h3>{formatCurrency(3500000)}</h3>
                <small>+15% vs. ayer</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card bg="success" text="white" className="mb-4">
              <Card.Body>
                <Card.Title>Clientes Activos</Card.Title>
                <h3>145</h3>
                <small>12 nuevos hoy</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card bg="warning" text="dark" className="mb-4">
              <Card.Body>
                <Card.Title>Personal en Turno</Card.Title>
                <h3>25/30</h3>
                <small>83% asistencia</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card bg="info" text="white" className="mb-4">
              <Card.Body>
                <Card.Title>Máquinas Activas</Card.Title>
                <h3>48/50</h3>
                <small>96% operativas</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Gráficos y estadísticas */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="bg-dark text-white mb-4">
              <Card.Body>
                <Card.Title>Ingresos Diarios</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={statsData.ingresosDiarios}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="fecha" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="ingresos" stroke="#8884d8" name="Ingresos" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="bg-dark text-white mb-4">
              <Card.Body>
                <Card.Title>Alertas de Inventario</Card.Title>
                <Table striped bordered hover variant="dark" responsive>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Stock</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsData.inventarioAlertas.map((item, index) => (
                      <tr key={index}>
                        <td>{item.item}</td>
                        <td>{item.stock}</td>
                        <td>
                          <span className={`badge bg-${item.stock < item.minimo ? 'danger' : 'success'}`}>
                            {item.stock < item.minimo ? 'Bajo' : 'OK'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Estadísticas de personal y juegos */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="bg-dark text-white mb-4">
              <Card.Body>
                <Card.Title>Estadísticas de Personal</Card.Title>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statsData.personalStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="area" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="personal" fill="#8884d8" name="Personal" />
                      <Bar dataKey="asistencia" fill="#82ca9d" name="% Asistencia" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="bg-dark text-white mb-4">
              <Card.Body>
                <Card.Title>Rendimiento de Juegos</Card.Title>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statsData.juegosStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="juego" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="uso" fill="#82ca9d" name="% Uso" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Últimas transacciones */}
        <Card className="bg-dark text-white">
          <Card.Body>
            <Card.Title className="mb-4">Últimas Transacciones</Card.Title>
            <Table striped bordered hover variant="dark" responsive>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {statsData.ultimasTransacciones.map((trans, index) => (
                  <tr key={index}>
                    <td>{trans.fecha}</td>
                    <td>{trans.descripcion}</td>
                    <td>{formatCurrency(trans.monto)}</td>
                    <td>
                      <Button variant="primary" size="sm" className="me-2">Detalles</Button>
                      <Button variant="secondary" size="sm">Imprimir</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

export default DashboardAdmin;