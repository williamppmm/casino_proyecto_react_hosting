import React, { useState } from 'react';
import { Container, Card, Table, Form, Button, Row, Col, Badge, Pagination } from 'react-bootstrap';
import { Calendar, Search, Download } from 'lucide-react';
import CustomDatePicker from '../../../components/forms/DatePicker';

const HistorialJuegos = () => {
  // Estados para los filtros y paginación
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [gameType, setGameType] = useState('all');

  // Datos de ejemplo basados en la documentación
  const mockHistory = [
    {
      id: 1,
      date: '2024-03-20',
      game: 'Póker Texas Hold\'em',
      type: 'Mesa',
      bet: 50000,
      result: 75000,
      status: 'win'
    },
    {
      id: 2,
      date: '2024-03-19',
      game: 'Ruleta Europea',
      type: 'Mesa',
      bet: 25000,
      result: 0,
      status: 'loss'
    },
    {
      id: 3,
      date: '2024-03-18',
      game: 'Lucky Fortune',
      type: 'Tragamonedas',
      bet: 10000,
      result: 35000,
      status: 'win'
    },
    {
      id: 4,
      date: '2024-03-17',
      game: 'Blackjack',
      type: 'Mesa',
      bet: 30000,
      result: 60000,
      status: 'win'
    },
    {
      id: 5,
      date: '2024-03-16',
      game: 'Golden Dragon',
      type: 'Tragamonedas',
      bet: 15000,
      result: 0,
      status: 'loss'
    }
  ];

  // Función para manejar la descarga del historial
  const handleDownload = () => {
    console.log('Descargando historial...');
  };

  // Función para renderizar el badge del estado
  const renderStatusBadge = (status) => {
    return (
      <Badge bg={status === 'win' ? 'success' : 'danger'}>
        {status === 'win' ? 'Ganado' : 'Perdido'}
      </Badge>
    );
  };

  // Función para formatear moneda en COP
  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Estilo común para las etiquetas
  const labelStyle = {
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem'
  };

  // Estilo común para los contenedores de Form.Group
  const formGroupStyle = {
    marginBottom: '1rem'
  };

  // Estilo común para los iconos
  const iconStyle = {
    className: "me-2",
    size: 18,
    color: "#fff"
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Header className="bg-transparent border-bottom border-secondary">
            <h2 className="mb-0 text-center">Historial de Juegos</h2>
          </Card.Header>
          
          <Card.Body className="p-4">
            {/* Filtros */}
            <Row className="mb-4 g-3">
              <Col md={4}>
                <Form.Group style={formGroupStyle}>
                  <Form.Label style={labelStyle}>
                    <Calendar {...iconStyle} />
                    Fecha Inicial
                  </Form.Label>
                  <div style={{ position: 'relative' }}>
                    <CustomDatePicker
                      id="fecha-inicial"
                      value={dateRange.start}
                      onDateChange={(date) => setDateRange({ ...dateRange, start: date })}
                      className="form-control bg-dark text-light border-secondary"
                    />
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group style={formGroupStyle}>
                  <Form.Label style={labelStyle}>
                    <Calendar {...iconStyle} />
                    Fecha Final
                  </Form.Label>
                  <div style={{ position: 'relative' }}>
                    <CustomDatePicker
                      id="fecha-final"
                      value={dateRange.end}
                      onDateChange={(date) => setDateRange({ ...dateRange, end: date })}
                      className="form-control bg-dark text-light border-secondary"
                    />
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group style={formGroupStyle}>
                  <Form.Label style={labelStyle}>
                    <Search {...iconStyle} />
                    Tipo de Juego
                  </Form.Label>
                  <Form.Select
                    value={gameType}
                    onChange={(e) => setGameType(e.target.value)}
                    className="form-control bg-dark text-light border-secondary"
                  >
                    <option value="all">Todos</option>
                    <option value="mesa">Juegos de Mesa</option>
                    <option value="tragamonedas">Tragamonedas</option>
                    <option value="online">Juegos Online</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Botón de descarga */}
            <div className="mb-3 text-end">
              <Button variant="outline-light" onClick={handleDownload}>
                <Download {...iconStyle} />
                Descargar Historial
              </Button>
            </div>

            {/* Tabla de historial */}
            <div className="table-responsive">
              <Table hover variant="dark" className="align-middle">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Juego</th>
                    <th>Tipo</th>
                    <th>Apuesta</th>
                    <th>Resultado</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {mockHistory.map((game) => (
                    <tr key={game.id}>
                      <td>{game.date}</td>
                      <td>{game.game}</td>
                      <td>{game.type}</td>
                      <td>{formatCOP(game.bet)}</td>
                      <td>{formatCOP(game.result)}</td>
                      <td>{renderStatusBadge(game.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Paginación */}
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
              </Pagination>
            </div>

            {/* Resumen estadístico */}
            <Row className="mt-4 g-3">
              <Col md={4}>
                <Card className="text-center bg-dark border-secondary">
                  <Card.Body>
                    <h6 className="text-light">Total Apostado</h6>
                    <h4 className="text-primary">{formatCOP(130000)}</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center bg-dark border-secondary">
                  <Card.Body>
                    <h6 className="text-light">Total Ganado</h6>
                    <h4 className="text-success">{formatCOP(170000)}</h4>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center bg-dark border-secondary">
                  <Card.Body>
                    <h6 className="text-light">Balance</h6>
                    <h4 className="text-info">{formatCOP(40000)}</h4>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default HistorialJuegos;