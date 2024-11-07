// src/pages/dashboard/DashboardRestaurant.js

import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Tab, Nav } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function DashboardRestaurant() {
  // Estado para inventario
  const [inventario] = useState([
    { id: 1, producto: 'Café', cantidad: 50, unidad: 'Kg', minimo: 20 },
    { id: 2, producto: 'Azúcar', cantidad: 100, unidad: 'Kg', minimo: 30 },
    { id: 3, producto: 'Leche', cantidad: 200, unidad: 'Lt', minimo: 50 },
    { id: 4, producto: 'Gaseosas', cantidad: 500, unidad: 'Unidades', minimo: 100 },
    { id: 5, producto: 'Licores', cantidad: 200, unidad: 'Unidades', minimo: 50 },
    { id: 6, producto: 'Pasabocas', cantidad: 1000, unidad: 'Unidades', minimo: 200 }
  ]);

  // Estado para formularios
  const [formEntrada, setFormEntrada] = useState({
    producto: '',
    cantidad: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const [formSalida, setFormSalida] = useState({
    producto: '',
    cantidad: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  // Datos para gráficos
  const [consumoSemanal] = useState([
    { dia: 'Lunes', bebidas: 120, alimentos: 80 },
    { dia: 'Martes', bebidas: 150, alimentos: 90 },
    { dia: 'Miércoles', bebidas: 180, alimentos: 100 },
    { dia: 'Jueves', bebidas: 200, alimentos: 120 },
    { dia: 'Viernes', bebidas: 250, alimentos: 150 },
    { dia: 'Sábado', bebidas: 300, alimentos: 200 },
    { dia: 'Domingo', bebidas: 280, alimentos: 180 }
  ]);

  const [tendenciaInventario] = useState([
    { fecha: '15/05', cafe: 60, azucar: 120, leche: 220 },
    { fecha: '16/05', cafe: 55, azucar: 110, leche: 210 },
    { fecha: '17/05', cafe: 50, azucar: 100, leche: 200 },
    { fecha: '18/05', cafe: 45, azucar: 90, leche: 190 },
    { fecha: '19/05', cafe: 40, azucar: 80, leche: 180 }
  ]);

  // Manejadores de formulario
  const handleEntradaSubmit = (e) => {
    e.preventDefault();
    console.log('Entrada registrada:', formEntrada);
    // Aquí iría la lógica para actualizar el inventario
  };

  const handleSalidaSubmit = (e) => {
    e.preventDefault();
    console.log('Salida registrada:', formSalida);
    // Aquí iría la lógica para actualizar el inventario
  };

  const handleEntradaChange = (e) => {
    const { name, value } = e.target;
    setFormEntrada(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalidaChange = (e) => {
    const { name, value } = e.target;
    setFormSalida(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section style={{ backgroundColor: '#141414', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container fluid className="p-4">
        <h1 className="text-center text-white mb-4">Dashboard Cafetería</h1>

        {/* Estadísticas Resumen */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="bg-dark text-white mb-4">
              <Card.Body>
                <Card.Title>Consumo Semanal</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={consumoSemanal}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="dia" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="bebidas" fill="#8884d8" name="Bebidas" />
                      <Bar dataKey="alimentos" fill="#82ca9d" name="Alimentos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="bg-dark text-white mb-4">
              <Card.Body>
                <Card.Title>Tendencia de Inventario</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tendenciaInventario}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="fecha" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cafe" stroke="#8884d8" name="Café" />
                      <Line type="monotone" dataKey="azucar" stroke="#82ca9d" name="Azúcar" />
                      <Line type="monotone" dataKey="leche" stroke="#ffc658" name="Leche" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabs de Gestión */}
        <Card className="bg-dark text-white">
          <Card.Body>
            <Tab.Container defaultActiveKey="inventory">
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="inventory" className="text-white">Inventario</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="inputs" className="text-white">Entradas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="outputs" className="text-white">Salidas</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="inventory">
                  <h4 className="mb-3">Inventario Actual</h4>
                  <Table responsive striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Unidad</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventario.map(item => (
                        <tr key={item.id}>
                          <td>{item.producto}</td>
                          <td>{item.cantidad}</td>
                          <td>{item.unidad}</td>
                          <td>
                            <span className={`badge bg-${item.cantidad > item.minimo ? 'success' : 'danger'}`}>
                              {item.cantidad > item.minimo ? 'OK' : 'Bajo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>

                <Tab.Pane eventKey="inputs">
                  <h4 className="mb-3">Registro de Entradas</h4>
                  <Form onSubmit={handleEntradaSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Producto</Form.Label>
                          <Form.Select
                            name="producto"
                            value={formEntrada.producto}
                            onChange={handleEntradaChange}
                            required
                            className="bg-dark text-white"
                          >
                            <option value="">Seleccione el producto</option>
                            {inventario.map(item => (
                              <option key={item.id} value={item.id}>
                                {item.producto}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Cantidad</Form.Label>
                          <Form.Control
                            type="number"
                            name="cantidad"
                            value={formEntrada.cantidad}
                            onChange={handleEntradaChange}
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
                            name="fecha"
                            value={formEntrada.fecha}
                            onChange={handleEntradaChange}
                            required
                            className="bg-dark text-white"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button variant="primary" type="submit">
                      Registrar Entrada
                    </Button>
                  </Form>
                </Tab.Pane>

                <Tab.Pane eventKey="outputs">
                  <h4 className="mb-3">Registro de Salidas</h4>
                  <Form onSubmit={handleSalidaSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Producto</Form.Label>
                          <Form.Select
                            name="producto"
                            value={formSalida.producto}
                            onChange={handleSalidaChange}
                            required
                            className="bg-dark text-white"
                          >
                            <option value="">Seleccione el producto</option>
                            {inventario.map(item => (
                              <option key={item.id} value={item.id}>
                                {item.producto}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Cantidad</Form.Label>
                          <Form.Control
                            type="number"
                            name="cantidad"
                            value={formSalida.cantidad}
                            onChange={handleSalidaChange}
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
                            name="fecha"
                            value={formSalida.fecha}
                            onChange={handleSalidaChange}
                            required
                            className="bg-dark text-white"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button variant="danger" type="submit">
                      Registrar Salida
                    </Button>
                  </Form>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </Container>
    </section>
  );
}

export default DashboardRestaurant;