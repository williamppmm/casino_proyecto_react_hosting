// src/pages/dashboard/client/TransaccionesCliente.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Table, Form, Button, Row, Col, Badge } from 'react-bootstrap';
import { Calendar, DollarSign, ArrowUpRight, ArrowDownRight, LogOut, Home } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomDatePicker from '../../../components/forms/DatePicker';

const TransaccionesCliente = () => {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [transactionType, setTransactionType] = useState('all');

  const [mockTransactions] = useState([
    {
      id: 1,
      date: '2024-03-25',
      type: 'deposit',
      description: 'Depósito inicial',
      amount: 500000,
      status: 'completed',
      balance: 500000
    },
    {
      id: 2,
      date: '2024-03-24',
      type: 'bet',
      description: 'Apuesta Poker',
      amount: -100000,
      status: 'completed',
      balance: 400000
    },
    {
      id: 3,
      date: '2024-03-24',
      type: 'win',
      description: 'Premio Poker',
      amount: 250000,
      status: 'completed',
      balance: 650000
    },
    {
      id: 4,
      date: '2024-03-23',
      type: 'withdrawal',
      description: 'Retiro bancario',
      amount: -200000,
      status: 'pending',
      balance: 450000
    },
    {
      id: 5,
      date: '2024-03-22',
      type: 'bonus',
      description: 'Bono de lealtad',
      amount: 50000,
      status: 'completed',
      balance: 500000
    }
  ]);

  const balanceData = [
    { date: '20 Mar', balance: 300000 },
    { date: '21 Mar', balance: 450000 },
    { date: '22 Mar', balance: 500000 },
    { date: '23 Mar', balance: 450000 },
    { date: '24 Mar', balance: 650000 },
    { date: '25 Mar', balance: 500000 }
  ];

  const transactionsByType = [
    { type: 'Depósitos', amount: 500000, color: '#28a745' },
    { type: 'Retiros', amount: -200000, color: '#dc3545' },
    { type: 'Apuestas', amount: -100000, color: '#ffc107' },
    { type: 'Premios', amount: 250000, color: '#17a2b8' },
    { type: 'Bonos', amount: 50000, color: '#6f42c1' }
  ];

  const renderStatusBadge = (status) => {
    const badgeMap = {
      completed: { bg: 'success', text: 'Completada' },
      pending: { bg: 'warning', text: 'Pendiente' },
      failed: { bg: 'danger', text: 'Fallida' }
    };
    const badgeInfo = badgeMap[status] || { bg: 'secondary', text: 'Desconocido' };

    return <Badge bg={badgeInfo.bg}>{badgeInfo.text}</Badge>;
  };

  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderTransactionTypeInfo = (type, amount) => {
    const typeConfig = {
      deposit: { icon: <ArrowUpRight className="text-success" />, class: 'text-success' },
      withdrawal: { icon: <ArrowDownRight className="text-danger" />, class: 'text-danger' },
      bet: { icon: <ArrowDownRight className="text-warning" />, class: 'text-warning' },
      win: { icon: <ArrowUpRight className="text-info" />, class: 'text-info' },
      bonus: { icon: <ArrowUpRight className="text-primary" />, class: 'text-primary' }
    };

    const config = typeConfig[type] || { icon: null, class: '' };

    return (
      <span className={`${config.class} d-flex align-items-center`}>
        {config.icon}
        <span className="ms-2">{formatCOP(amount)}</span>
      </span>
    );
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login-usuario');
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Header className="bg-primary text-light">
            <h2 className="mb-0 text-center">Historial de Transacciones</h2>
          </Card.Header>

          <Card.Body className="p-4">
            {/* Filtros */}
            <Row className="mb-4 g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-light d-flex align-items-center mb-2">
                    <Calendar size={18} className="me-2" /> Fecha Inicial
                  </Form.Label>
                  <CustomDatePicker
                    id="fecha-inicial"
                    value={dateRange.start}
                    onDateChange={(date) => setDateRange({ ...dateRange, start: date })}
                    className="form-control bg-dark text-light border-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-light d-flex align-items-center mb-2">
                    <Calendar size={18} className="me-2" /> Fecha Final
                  </Form.Label>
                  <CustomDatePicker
                    id="fecha-final"
                    value={dateRange.end}
                    onDateChange={(date) => setDateRange({ ...dateRange, end: date })}
                    className="form-control bg-dark text-light border-secondary"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="text-light d-flex align-items-center mb-2">
                    <DollarSign size={18} className="me-2" /> Tipo de Transacción
                  </Form.Label>
                  <Form.Select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="form-control bg-dark text-light border-secondary"
                  >
                    <option value="all">Todas las Transacciones</option>
                    <option value="deposit">Depósitos</option>
                    <option value="withdrawal">Retiros</option>
                    <option value="bet">Apuestas</option>
                    <option value="win">Premios</option>
                    <option value="bonus">Bonos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Gráficos */}
            <Row className="mb-4">
              <Col md={8}>
                <Card className="bg-dark border-secondary mb-4">
                  <Card.Body>
                    <h5 className="text-light mb-4">Balance Histórico</h5>
                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={balanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="date" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#141414', border: '1px solid #333' }}
                            labelStyle={{ color: '#fff' }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="balance" stroke="#0d6efd" name="Balance" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="bg-dark border-secondary mb-4">
                  <Card.Body>
                    <h5 className="text-light mb-4">Transacciones por Tipo</h5>
                    <div style={{ height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={transactionsByType}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="type" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#141414', border: '1px solid #333' }}
                            labelStyle={{ color: '#fff' }}
                          />
                          <Bar dataKey="amount" fill="#0d6efd" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Tabla */}
            <Table hover variant="dark" className="align-middle">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Balance</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.description}</td>
                    <td>{renderTransactionTypeInfo(transaction.type, transaction.amount)}</td>
                    <td>{formatCOP(transaction.balance)}</td>
                    <td>{renderStatusBadge(transaction.status)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Resumen */}
            <Row className="mt-4 g-3">
              <Col md={3}>
                <Card className="text-center bg-dark border-secondary">
                  <Card.Body>
                    <h6 className="text-light">Total Depósitos</h6>
                    <h4 className="text-success">{formatCOP(500000)}</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center bg-dark border-secondary">
                  <Card.Body>
                    <h6 className="text-light">Total Retiros</h6>
                    <h4 className="text-danger">{formatCOP(200000)}</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center bg-dark border-secondary">
                  <Card.Body>
                    <h6 className="text-light">Ganancias Netas</h6>
                    <h4 className="text-info">{formatCOP(150000)}</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center bg-dark border-secondary">
                  <Card.Body>
                    <h6 className="text-light">Balance Actual</h6>
                    <h4 className="text-primary">{formatCOP(500000)}</h4>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Botones adicionales */}
        <div className="mt-4 text-center">
          <Button
            variant="outline-primary"
            className="btn btn-outline-primary px-4 py-2 me-2"
            onClick={() => navigate('/dashboard-cliente')}
          >
            <Home size={18} className="me-2" /> Dashboard
          </Button>
          <Button
            variant="outline-danger"
            className="btn btn-outline-danger px-4 py-2"
            onClick={handleLogout}
          >
            <LogOut size={18} className="me-2" /> Cerrar Sesión
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default TransaccionesCliente;