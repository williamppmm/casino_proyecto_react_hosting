// src/pages/home/Promociones.js

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Promociones = () => {

  const promociones = [
    { id: 1, titulo: 'Bono de Bienvenida', descripcion: '¡Duplicamos tu primer depósito hasta $500.000 COP!' },
    { id: 2, titulo: 'Martes de Tragamonedas', descripcion: '50% extra en todas tus recargas los martes.' },
    { id: 3, titulo: 'Torneo de Póker Semanal', descripcion: 'Participa todos los jueves por un premio de $5.000.000 COP.' },
    { id: 4, titulo: 'Giros Gratis de Fin de Semana', descripcion: 'Obtén 50 giros gratis en nuestras tragamonedas seleccionadas cada fin de semana.' },
    { id: 5, titulo: 'Cashback de Viernes', descripcion: 'Recibe el 10% de cashback en todas tus pérdidas de los viernes.' },
    { id: 6, titulo: 'Bono de Recarga Mensual', descripcion: 'Obtén un bono del 100% en tu primera recarga de cada mes, hasta $250.000 COP.' },
  ];

  return (
    <section className="promociones-section py-5" style={{ backgroundColor: '#141414', color: '#fff', minHeight: '100vh', marginTop: '65px' }}>
    <Container>
        <h1 className="text-center mb-5" style={{ fontWeight: 'bold' }}>Promociones Actuales</h1>
        <Row>
        {promociones.map((promo) => (
            <Col md={4} key={promo.id} className="mb-4">
            <Card className="bg-dark text-white h-100 shadow-lg border-0">
                <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                    <Card.Title className="mb-3">{promo.titulo}</Card.Title>
                    <Card.Text>{promo.descripcion}</Card.Text>
                </div>
                <Button variant="primary" className="mt-3">Aprovechar Promoción</Button>
                </Card.Body>
            </Card>
            </Col>
        ))}
        </Row>
        
        <Row className="text-center mt-4">
          <Col>
            <p className="text-light">
              ¿Ya eres cliente? <Link to="/login-usuario" className="text-primary">Inicia sesión aquí</Link>
            </p>
          </Col>
        </Row>
    </Container>
    </section>
  );
};

export default Promociones;