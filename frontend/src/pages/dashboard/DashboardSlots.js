// src/pages/dashboard/DashboardSlots.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DashboardSlots() {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    machine_number: '',
    date: new Date().toISOString().split('T')[0],
    coin_in: '',
    coin_out: '',
    jackpot: '',
    balance: '0'
  });

  // Estado para datos estadísticos
  const [statsData, setStatsData] = useState({
    totalMaquinas: 50,
    maquinasActivas: 45,
    totalIngresos: 1500000,
    totalPagos: 550000,
  });

  // Estado para el historial
  const [historialRegistros] = useState([
    {
      fecha: '2024-05-19',
      maquina: 'Máquina 1',
      coinIn: 500000,
      coinOut: 200000,
      jackpot: 50000,
      balance: 250000
    },
    {
      fecha: '2024-05-18',
      maquina: 'Máquina 2',
      coinIn: 400000,
      coinOut: 150000,
      jackpot: 0,
      balance: 250000
    },
    {
      fecha: '2024-05-17',
      maquina: 'Máquina 3',
      coinIn: 600000,
      coinOut: 300000,
      jackpot: 100000,
      balance: 200000
    }
  ]);

  // Datos para el gráfico
  const [chartData] = useState([
    { fecha: '15/05', ingresos: 1200000, pagos: 800000 },
    { fecha: '16/05', ingresos: 1500000, pagos: 900000 },
    { fecha: '17/05', ingresos: 1300000, pagos: 700000 },
    { fecha: '18/05', ingresos: 1600000, pagos: 1000000 },
    { fecha: '19/05', ingresos: 1400000, pagos: 850000 }
  ]);

  // Calcular balance automáticamente
  useEffect(() => {
    const coinIn = parseFloat(formData.coin_in) || 0;
    const coinOut = parseFloat(formData.coin_out) || 0;
    const jackpot = parseFloat(formData.jackpot) || 0;
    const balance = coinIn - coinOut - jackpot;
    setFormData(prev => ({ ...prev, balance: balance.toString() }));
  }, [formData.coin_in, formData.coin_out, formData.jackpot]);

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
        <h1 className="text-center text-white mb-4">Dashboard Máquinas Tragamonedas</h1>

        {/* Tarjetas de Resumen */}
        <Row className="mb-4">
          <Col md={3}>
            <Card bg="primary" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Total Máquinas</Card.Title>
                <h3>{statsData.totalMaquinas}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="success" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Máquinas Activas</Card.Title>
                <h3>{statsData.maquinasActivas}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="info" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Total Ingresos Hoy</Card.Title>
                <h3>{formatCurrency(statsData.totalIngresos)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="warning" text="dark" className="mb-3">
              <Card.Body>
                <Card.Title>Total Pagos Hoy</Card.Title>
                <h3>{formatCurrency(statsData.totalPagos)}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Gráfico de Rendimiento */}
        <Card className="bg-dark text-white mb-4">
          <Card.Body>
            <Card.Title>Rendimiento Diario</Card.Title>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="fecha" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#82ca9d" name="Ingresos" />
                  <Line type="monotone" dataKey="pagos" stroke="#ff8042" name="Pagos" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>

        {/* Formulario de Registro */}
        <Card className="bg-dark text-white mb-4">
          <Card.Body>
            <Card.Title>Registro de Datos</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Número de Máquina</Form.Label>
                    <Form.Control
                      type="text"
                      name="machine_number"
                      value={formData.machine_number}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
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
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Coin In</Form.Label>
                    <Form.Control
                      type="number"
                      name="coin_in"
                      value={formData.coin_in}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Coin Out</Form.Label>
                    <Form.Control
                      type="number"
                      name="coin_out"
                      value={formData.coin_out}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Jackpot</Form.Label>
                    <Form.Control
                      type="number"
                      name="jackpot"
                      value={formData.jackpot}
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
                    <Form.Label>Balance</Form.Label>
                    <Form.Control
                      type="text"
                      value={formatCurrency(parseFloat(formData.balance) || 0)}
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

        {/* Historial de Registros */}
        <Card className="bg-dark text-white mb-4">
          <Card.Body>
            <Card.Title>Historial de Registros</Card.Title>
            <Table responsive striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Máquina</th>
                  <th>Coin In</th>
                  <th>Coin Out</th>
                  <th>Jackpot</th>
                  <th>Balance</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {historialRegistros.map((registro, index) => (
                  <tr key={index}>
                    <td>{registro.fecha}</td>
                    <td>{registro.maquina}</td>
                    <td>{formatCurrency(registro.coinIn)}</td>
                    <td>{formatCurrency(registro.coinOut)}</td>
                    <td>{formatCurrency(registro.jackpot)}</td>
                    <td>{formatCurrency(registro.balance)}</td>
                    <td>
                      <Button variant="info" size="sm" className="me-2">Editar</Button>
                      <Button variant="danger" size="sm">Eliminar</Button>
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

export default DashboardSlots;