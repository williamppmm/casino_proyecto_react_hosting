// src/pages/dashboard/DashboardFinanciero.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Table } from 'react-bootstrap';

function DashboardFinanciero() {
  const [financialData] = useState({
    ingresosMes: 15500000,
    gastosMes: 8000000,
    tragamonedas: [
      { maquina: 'Máquina 1', ingresos: 500000, pagos: 200000, balance: 300000 },
      { maquina: 'Máquina 2', ingresos: 400000, pagos: 150000, balance: 250000 },
      { maquina: 'Máquina 3', ingresos: 600000, pagos: 300000, balance: 300000 },
    ],
    juegosOnline: [
      { juego: 'Poker', ingresos: 200000, pagos: 100000, balance: 100000 },
      { juego: 'Blackjack', ingresos: 150000, pagos: 75000, balance: 75000 },
      { juego: 'Ruleta', ingresos: 300000, pagos: 200000, balance: 100000 },
    ],
    apuestasDeportivas: [
      { deporte: 'Fútbol', ingresos: 1000000, pagos: 800000, balance: 200000 },
      { deporte: 'Baloncesto', ingresos: 500000, pagos: 400000, balance: 100000 },
      { deporte: 'Tenis', ingresos: 300000, pagos: 200000, balance: 100000 },
    ],
    nomina: [
      { empleado: 'Juan Pérez', cargo: 'Gerente', salario: 5000000 },
      { empleado: 'María González', cargo: 'Supervisor', salario: 3000000 },
      { empleado: 'Pedro Ramírez', cargo: 'Cajero', salario: 2000000 },
    ],
    gastosGenerales: [
      { concepto: 'Servicios Públicos', monto: 2000000 },
      { concepto: 'Mantenimiento', monto: 1500000 },
      { concepto: 'Publicidad', monto: 3000000 },
    ],
    cafeteria: [
      { concepto: 'Insumos', monto: 1000000 },
      { concepto: 'Bebidas', monto: 500000 },
      { concepto: 'Alimentos', monto: 1500000 },
    ],
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section style={{ backgroundColor: '#141414', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container fluid className="p-4">
        <h1 className="text-center text-white mb-4">Departamento Contable</h1>

        {/* Resumen General */}
        <Row className="mb-4">
          <Col md={6}>
            <Card bg="success" text="white">
              <Card.Body>
                <Card.Title>Ingresos del Mes</Card.Title>
                <h3>{formatCurrency(financialData.ingresosMes)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card bg="danger" text="white">
              <Card.Body>
                <Card.Title>Gastos del Mes</Card.Title>
                <h3>{formatCurrency(financialData.gastosMes)}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabs de Información */}
        <Card className="bg-dark text-white">
          <Card.Body>
            <Tab.Container defaultActiveKey="tragamonedas">
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="tragamonedas" className="text-white">Tragamonedas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="online" className="text-white">Online</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="deportivas" className="text-white">Deportivas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="nomina" className="text-white">Nómina</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="mt-3">
                <Tab.Pane eventKey="tragamonedas">
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Máquina</th>
                        <th>Ingresos</th>
                        <th>Pagos</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialData.tragamonedas.map((item, index) => (
                        <tr key={index}>
                          <td>{item.maquina}</td>
                          <td>{formatCurrency(item.ingresos)}</td>
                          <td>{formatCurrency(item.pagos)}</td>
                          <td>{formatCurrency(item.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>

                <Tab.Pane eventKey="online">
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Juego</th>
                        <th>Ingresos</th>
                        <th>Pagos</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialData.juegosOnline.map((item, index) => (
                        <tr key={index}>
                          <td>{item.juego}</td>
                          <td>{formatCurrency(item.ingresos)}</td>
                          <td>{formatCurrency(item.pagos)}</td>
                          <td>{formatCurrency(item.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>

                <Tab.Pane eventKey="deportivas">
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Deporte</th>
                        <th>Ingresos</th>
                        <th>Pagos</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialData.apuestasDeportivas.map((item, index) => (
                        <tr key={index}>
                          <td>{item.deporte}</td>
                          <td>{formatCurrency(item.ingresos)}</td>
                          <td>{formatCurrency(item.pagos)}</td>
                          <td>{formatCurrency(item.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>

                <Tab.Pane eventKey="nomina">
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>Empleado</th>
                        <th>Cargo</th>
                        <th>Salario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialData.nomina.map((item, index) => (
                        <tr key={index}>
                          <td>{item.empleado}</td>
                          <td>{item.cargo}</td>
                          <td>{formatCurrency(item.salario)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>

        {/* Gastos Generales */}
        <Row className="mt-4">
          <Col md={6}>
            <Card className="bg-dark text-white mb-4">
              <Card.Body>
                <Card.Title>Gastos Generales</Card.Title>
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.gastosGenerales.map((item, index) => (
                      <tr key={index}>
                        <td>{item.concepto}</td>
                        <td>{formatCurrency(item.monto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="bg-dark text-white mb-4">
              <Card.Body>
                <Card.Title>Cafetería</Card.Title>
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.cafeteria.map((item, index) => (
                      <tr key={index}>
                        <td>{item.concepto}</td>
                        <td>{formatCurrency(item.monto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default DashboardFinanciero;