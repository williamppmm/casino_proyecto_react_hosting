// src/pages/dashboard/DashboardOnlineGames.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function DashboardOnlineGames() {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    game_type: '',
    date: new Date().toISOString().split('T')[0],
    income: '',
    expenses: '',
    balance: '0'
  });

  // Estado para datos estadísticos
  const [statsData] = useState({
    usuariosActivos: 145,
    sesionesHoy: 320,
    ingresosTotales: 2400000,
    egresosTotales: 1700000
  });

  // Datos para el gráfico de participación por juego
  const [pieData] = useState([
    { name: 'Slots', value: 45 },
    { name: 'Ruleta', value: 25 },
    { name: 'En Vivo', value: 20 },
    { name: 'Cartas', value: 10 },
  ]);

  // Datos para el gráfico de tendencias
  const [chartData] = useState([
    { fecha: '15/05', ingresos: 2100000, egresos: 1500000 },
    { fecha: '16/05', ingresos: 2300000, egresos: 1600000 },
    { fecha: '17/05', ingresos: 2000000, egresos: 1400000 },
    { fecha: '18/05', ingresos: 2200000, egresos: 1550000 },
    { fecha: '19/05', ingresos: 2400000, egresos: 1700000 }
  ]);

  // Estado para el historial
  const [historialRegistros] = useState([
    {
      fecha: '2024-05-19',
      tipoJuego: 'Slots',
      ingresos: 800000,
      egresos: 500000,
      balance: 300000
    },
    {
      fecha: '2024-05-18',
      tipoJuego: 'Ruleta',
      ingresos: 600000,
      egresos: 400000,
      balance: 200000
    },
    {
      fecha: '2024-05-17',
      tipoJuego: 'Cartas',
      ingresos: 1000000,
      egresos: 800000,
      balance: 200000
    }
  ]);

  // Tipos de juegos disponibles
  const tiposJuego = [
    { value: 'slots', label: 'Slots' },
    { value: 'roulette', label: 'Ruleta' },
    { value: 'live', label: 'En Vivo' },
    { value: 'cards', label: 'Cartas' }
  ];

  // Colores para el gráfico de pie
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Efecto para calcular el balance
  useEffect(() => {
    const ingresos = parseFloat(formData.income) || 0;
    const egresos = parseFloat(formData.expenses) || 0;
    const balance = ingresos - egresos;
    setFormData(prev => ({ ...prev, balance: balance.toString() }));
  }, [formData.income, formData.expenses]);

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
        <h1 className="text-center text-white mb-4">Dashboard Juegos en Línea</h1>

        {/* Tarjetas de Resumen */}
        <Row className="mb-4">
          <Col md={3}>
            <Card bg="primary" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Usuarios Activos</Card.Title>
                <h3>{statsData.usuariosActivos}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="success" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Sesiones Hoy</Card.Title>
                <h3>{statsData.sesionesHoy}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="info" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Ingresos Totales</Card.Title>
                <h3>{formatCurrency(statsData.ingresosTotales)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="warning" text="dark" className="mb-3">
              <Card.Body>
                <Card.Title>Egresos Totales</Card.Title>
                <h3>{formatCurrency(statsData.egresosTotales)}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Gráficos */}
        <Row className="mb-4">
          <Col md={8}>
            <Card className="bg-dark text-white mb-3">
              <Card.Body>
                <Card.Title>Tendencias de Ingresos y Egresos</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="fecha" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="ingresos" stroke="#82ca9d" name="Ingresos" />
                      <Line type="monotone" dataKey="egresos" stroke="#ff8042" name="Egresos" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="bg-dark text-white mb-3">
              <Card.Body>
                <Card.Title>Participación por Juego</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
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
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Juego</Form.Label>
                    <Form.Select
                      name="game_type"
                      value={formData.game_type}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    >
                      <option value="">Seleccione el tipo de juego</option>
                      {tiposJuego.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                      ))}
                    </Form.Select>
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
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ingresos</Form.Label>
                    <Form.Control
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Egresos</Form.Label>
                    <Form.Control
                      type="number"
                      name="expenses"
                      value={formData.expenses}
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
                  <th>Tipo de Juego</th>
                  <th>Ingresos</th>
                  <th>Egresos</th>
                  <th>Balance</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {historialRegistros.map((registro, index) => (
                  <tr key={index}>
                    <td>{registro.fecha}</td>
                    <td>{registro.tipoJuego}</td>
                    <td>{formatCurrency(registro.ingresos)}</td>
                    <td>{formatCurrency(registro.egresos)}</td>
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

export default DashboardOnlineGames;