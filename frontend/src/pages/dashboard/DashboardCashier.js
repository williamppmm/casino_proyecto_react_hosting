// src/pages/dashboard/DashboardCashier.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function DashboardCashier() {
  // Estado para el formulario de transacciones
  const [formData, setFormData] = useState({
    transaction_type: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Datos para el balance diario
  const [balanceData] = useState([
    { fecha: '2024-05-19', ingresos: 5000000, egresos: 3000000, balance: 2000000 },
    { fecha: '2024-05-18', ingresos: 4800000, egresos: 2800000, balance: 2000000 },
    { fecha: '2024-05-17', ingresos: 5200000, egresos: 3100000, balance: 2100000 }
  ]);

  // Datos para los gráficos
  const [flujoSemanal] = useState([
    { dia: 'Lunes', ingresos: 4800000, egresos: 2800000 },
    { dia: 'Martes', ingresos: 5200000, egresos: 3100000 },
    { dia: 'Miércoles', ingresos: 5000000, egresos: 2900000 },
    { dia: 'Jueves', ingresos: 5500000, egresos: 3200000 },
    { dia: 'Viernes', ingresos: 6000000, egresos: 3500000 },
    { dia: 'Sábado', ingresos: 7000000, egresos: 4000000 },
    { dia: 'Domingo', ingresos: 6500000, egresos: 3800000 }
  ]);

  // Datos para el gráfico de distribución de ingresos
  const [distribucionIngresos] = useState([
    { name: 'Tragamonedas', value: 45 },
    { name: 'Juegos Online', value: 25 },
    { name: 'Apuestas Deportivas', value: 20 },
    { name: 'Cafetería', value: 10 }
  ]);

  // Colores para el gráfico de pie
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Estado para estadísticas generales
  const [stats] = useState({
    balanceActual: 2000000,
    ingresosHoy: 5000000,
    egresosHoy: 3000000,
    transaccionesHoy: 45
  });

  // Tipos de transacciones
  const tiposTransaccion = [
    { value: 'ingreso', label: 'Ingreso' },
    { value: 'egreso', label: 'Egreso' }
  ];

  // Manejador del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Transacción registrada:', formData);
    // Aquí iría la lógica para registrar la transacción
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
        <h1 className="text-center text-white mb-4">Dashboard Caja</h1>

        {/* Tarjetas de Resumen */}
        <Row className="mb-4">
          <Col md={3}>
            <Card bg="primary" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Balance Actual</Card.Title>
                <h3>{formatCurrency(stats.balanceActual)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="success" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Ingresos Hoy</Card.Title>
                <h3>{formatCurrency(stats.ingresosHoy)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="danger" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Egresos Hoy</Card.Title>
                <h3>{formatCurrency(stats.egresosHoy)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="info" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Transacciones Hoy</Card.Title>
                <h3>{stats.transaccionesHoy}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Gráficos */}
        <Row className="mb-4">
          <Col md={8}>
            <Card className="bg-dark text-white mb-3">
              <Card.Body>
                <Card.Title>Flujo de Caja Semanal</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={flujoSemanal}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="dia" stroke="#fff" />
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
                <Card.Title>Distribución de Ingresos</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distribucionIngresos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distribucionIngresos.map((entry, index) => (
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

        {/* Formulario de Registro de Transacciones */}
        <Card className="bg-dark text-white mb-4">
          <Card.Body>
            <Card.Title>Registro de Transacciones</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Transacción</Form.Label>
                    <Form.Select
                      name="transaction_type"
                      value={formData.transaction_type}
                      onChange={handleInputChange}
                      required
                      className="bg-dark text-white"
                    >
                      <option value="">Seleccione el tipo de transacción</option>
                      {tiposTransaccion.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Monto</Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={formData.amount}
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
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={formData.description}
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
              <Button variant="primary" type="submit">
                Registrar Transacción
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Balance de Caja */}
        <Card className="bg-dark text-white">
          <Card.Body>
            <Card.Title>Balance de Caja</Card.Title>
            <Table responsive striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Ingresos</th>
                  <th>Egresos</th>
                  <th>Balance</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {balanceData.map((balance, index) => (
                  <tr key={index}>
                    <td>{balance.fecha}</td>
                    <td>{formatCurrency(balance.ingresos)}</td>
                    <td>{formatCurrency(balance.egresos)}</td>
                    <td>{formatCurrency(balance.balance)}</td>
                    <td>
                      <Button variant="info" size="sm" className="me-2">Ver Detalles</Button>
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

export default DashboardCashier;