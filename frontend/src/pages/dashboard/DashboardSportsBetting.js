// src/pages/dashboard/DashboardSportsBetting.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

function DashboardSportsBetting() {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    tickets_sold: '',
    recharges_sold: '',
    prizes_generated: '',
    prizes_paid: '',
    withdrawals_paid: '',
    total_sales: '',
    total_paid: '',
    total_profitability: '0'
  });

  // Estado para datos estadísticos
  const [statsData] = useState({
    totalUsuarios: 250,
    apuestasActivas: 85,
    ingresosDiarios: 3500000,
    premiosPendientes: 1200000
  });

  // Datos para el gráfico de tendencias
  const [chartData] = useState([
    { fecha: '15/05', ventas: 3200000, pagos: 2100000, rentabilidad: 1100000 },
    { fecha: '16/05', ventas: 3500000, pagos: 2300000, rentabilidad: 1200000 },
    { fecha: '17/05', ventas: 3300000, pagos: 2000000, rentabilidad: 1300000 },
    { fecha: '18/05', ventas: 3600000, pagos: 2400000, rentabilidad: 1200000 },
    { fecha: '19/05', ventas: 3500000, pagos: 2200000, rentabilidad: 1300000 }
  ]);

  // Datos para el gráfico de tickets por deporte
  const [ticketsBySport] = useState([
    { deporte: 'Fútbol', tickets: 120 },
    { deporte: 'Baloncesto', tickets: 45 },
    { deporte: 'Tenis', tickets: 30 },
    { deporte: 'Béisbol', tickets: 25 },
    { deporte: 'Otros', tickets: 15 }
  ]);

  // Calcular rentabilidad total
  useEffect(() => {
    const totalSales = parseFloat(formData.total_sales) || 0;
    const totalPaid = parseFloat(formData.total_paid) || 0;
    const profitability = totalSales - totalPaid;
    setFormData(prev => ({ ...prev, total_profitability: profitability.toString() }));
  }, [formData.total_sales, formData.total_paid]);

  // Manejador del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    // Aquí iría la lógica para enviar al backend
  };

  // Formateo de moneda
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
        <h1 className="text-center text-white mb-4">Dashboard Apuestas Deportivas</h1>

        {/* Tarjetas de Resumen */}
        <Row className="mb-4">
          <Col md={3}>
            <Card bg="primary" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Total Usuarios</Card.Title>
                <h3>{statsData.totalUsuarios}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="success" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Apuestas Activas</Card.Title>
                <h3>{statsData.apuestasActivas}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="info" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Ingresos Diarios</Card.Title>
                <h3>{formatCurrency(statsData.ingresosDiarios)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="warning" text="dark" className="mb-3">
              <Card.Body>
                <Card.Title>Premios Pendientes</Card.Title>
                <h3>{formatCurrency(statsData.premiosPendientes)}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Gráficos */}
        <Row className="mb-4">
          <Col md={8}>
            <Card className="bg-dark text-white mb-3">
              <Card.Body>
                <Card.Title>Tendencias de Ventas y Pagos</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="fecha" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="ventas" stroke="#82ca9d" name="Ventas" />
                      <Line type="monotone" dataKey="pagos" stroke="#ff8042" name="Pagos" />
                      <Line type="monotone" dataKey="rentabilidad" stroke="#8884d8" name="Rentabilidad" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white mb-3">
              <Card.Body>
                <Card.Title>Tickets por Deporte</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ticketsBySport}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="deporte" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tickets" fill="#8884d8" name="Tickets" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Formulario de Registro */}
        <Card className="bg-dark text-white mb-4">
          <Card.Body>
            <Card.Title>Registro de Datos</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>N° Tickets Vendidos</Form.Label>
                    <Form.Control
                      type="number"
                      name="tickets_sold"
                      value={formData.tickets_sold}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Recargas Vendidas</Form.Label>
                    <Form.Control
                      type="number"
                      name="recharges_sold"
                      value={formData.recharges_sold}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Premios Generados</Form.Label>
                    <Form.Control
                      type="number"
                      name="prizes_generated"
                      value={formData.prizes_generated}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Premios Pagados a la Fecha</Form.Label>
                    <Form.Control
                      type="number"
                      name="prizes_paid"
                      value={formData.prizes_paid}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Total Ventas</Form.Label>
                    <Form.Control
                      type="number"
                      name="total_sales"
                      value={formData.total_sales}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Total Pagado</Form.Label>
                    <Form.Control
                      type="number"
                      name="total_paid"
                      value={formData.total_paid}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rentabilidad Total</Form.Label>
                    <Form.Control
                      type="text"
                      value={formatCurrency(parseFloat(formData.total_profitability) || 0)}
                      disabled
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" type="submit">
                Registrar
              </Button>
            </Form>
          </Card.Body>
        </Card>

      </Container>
    </section>
  );
}

export default DashboardSportsBetting;