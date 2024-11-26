// src/pages/dashboard/client/PromocionesCliente.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Table, Form, Button, Row, Col, Badge } from 'react-bootstrap';
import { Tag, Calendar, Gift, LogOut, Home } from 'lucide-react';
import CustomDatePicker from '../../../components/forms/DatePicker';

const PromocionesCliente = () => {
  const navigate = useNavigate();

  // Estados para los filtros y datos
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [promoType, setPromoType] = useState('all');
  const [mockPromotions] = useState([
    {
      id: 1,
      date: '2024-03-25',
      title: 'Bono de Bienvenida',
      type: 'Bono',
      amount: 200000,
      status: 'active',
      expiry: '2024-04-25',
      requirements: 'Depósito mínimo $50.000'
    },
    {
      id: 2,
      date: '2024-03-24',
      title: 'Giros Gratis Slots',
      type: 'Tragamonedas',
      amount: 50,
      status: 'pending',
      expiry: '2024-04-24',
      requirements: '20 giros en Golden Dragon'
    },
    {
      id: 3,
      date: '2024-03-23',
      title: 'Cashback Fin de Semana',
      type: 'Reembolso',
      amount: 100000,
      status: 'expired',
      expiry: '2024-03-24',
      requirements: 'Pérdidas en juegos de mesa'
    },
    {
      id: 4,
      date: '2024-03-22',
      title: 'Multiplicador de Puntos',
      type: 'Puntos VIP',
      amount: 0,
      status: 'active',
      expiry: '2024-04-22',
      requirements: 'Jugar en mesas VIP'
    },
    {
      id: 5,
      date: '2024-03-21',
      title: 'Torneo de Póker',
      type: 'Torneo',
      amount: 1000000,
      status: 'pending',
      expiry: '2024-04-21',
      requirements: 'Buy-in $100.000'
    }
  ]);

  // Renderizar estado como badge
  const renderStatusBadge = (status) => {
    const badgeMap = {
      active: { bg: 'success', text: 'Activa' },
      pending: { bg: 'warning', text: 'Pendiente' },
      expired: { bg: 'danger', text: 'Expirada' }
    };

    const badgeInfo = badgeMap[status] || { bg: 'secondary', text: 'Desconocido' };

    return (
      <Badge bg={badgeInfo.bg}>
        {badgeInfo.text}
      </Badge>
    );
  };

  // Formatear moneda
  const formatCOP = (amount) => {
    if (typeof amount !== 'number') return amount;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Cerrar sesión
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login-usuario');
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
        <Card.Header className="bg-primary text-light">
            <h2 className="mb-0 text-center">Promociones</h2>
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
                    <Tag size={18} className="me-2" /> Tipo de Promoción
                  </Form.Label>
                  <Form.Select
                    value={promoType}
                    onChange={(e) => setPromoType(e.target.value)}
                    className="form-control bg-dark text-light border-secondary"
                  >
                    <option value="all">Todas las Promociones</option>
                    <option value="bonos">Bonos</option>
                    <option value="torneos">Torneos</option>
                    <option value="cashback">Cashback</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Tabla */}
            <Table hover variant="dark" className="align-middle">
              <thead>
                <tr>
                  <th>Fecha Inicio</th>
                  <th>Promoción</th>
                  <th>Tipo</th>
                  <th>Beneficio</th>
                  <th>Requisitos</th>
                  <th>Expiración</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {mockPromotions.map((promo) => (
                  <tr key={promo.id}>
                    <td>{promo.date}</td>
                    <td>{promo.title}</td>
                    <td>{promo.type}</td>
                    <td>{typeof promo.amount === 'number' ? formatCOP(promo.amount) : `${promo.amount} giros`}</td>
                    <td>{promo.requirements}</td>
                    <td>{promo.expiry}</td>
                    <td>{renderStatusBadge(promo.status)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Resumen */}
            <Row className="mt-4 g-3">
              <Col md={4}>
                <Card className="text-center bg-dark border-secondary">
                  <Card.Body>
                    <Gift size={24} className="text-primary mb-2" />
                    <h6 className="text-light">Activas</h6>
                    <h4 className="text-primary">2</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center bg-dark border-secondary">
                  <Card.Body>
                    <h6 className="text-light">Pendientes</h6>
                    <h4 className="text-warning">3</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center bg-dark border-secondary">
                  <Card.Body>
                    <h6 className="text-light">Expiradas</h6>
                    <h4 className="text-danger">5</h4>
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

export default PromocionesCliente;