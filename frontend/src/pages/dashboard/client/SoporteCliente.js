import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Table, Form, Button, Row, Col, Nav, Tab, Badge } from 'react-bootstrap';
import { TicketIcon, Phone, Mail, MapPin, HelpCircle, Clock, Plus, Send, Home, LogOut } from 'lucide-react';

const SoporteCliente = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tickets');
  const [newTicket, setNewTicket] = useState({
    asunto: '',
    categoria: '',
    descripcion: '',
    prioridad: 'media',
  });

  // Tickets de ejemplo
  const tickets = [
    {
      id: 'TK-001',
      fecha: '2024-03-25',
      asunto: 'Problema con retiro',
      categoria: 'Pagos',
      estado: 'abierto',
      prioridad: 'alta',
    },
    {
      id: 'TK-002',
      fecha: '2024-03-24',
      asunto: 'Error en juego de slots',
      categoria: 'Técnico',
      estado: 'en_proceso',
      prioridad: 'media',
    },
    {
      id: 'TK-003',
      fecha: '2024-03-23',
      asunto: 'Consulta sobre bono',
      categoria: 'Promociones',
      estado: 'resuelto',
      prioridad: 'baja',
    },
  ];

  // FAQs comunes
  const faqs = [
    {
      pregunta: '¿Cómo puedo realizar un depósito?',
      respuesta: 'Diríjase a la sección "Depósitos" en su panel de usuario.',
    },
    {
      pregunta: '¿Cuál es el tiempo de procesamiento de los retiros?',
      respuesta: 'Los retiros se procesan en un plazo de 24-48 horas hábiles.',
    },
    {
      pregunta: '¿Cómo puedo verificar mi cuenta?',
      respuesta: 'Debe cargar documentos en la sección "Verificación".',
    },
    {
      pregunta: '¿Qué hago si olvido mi contraseña?',
      respuesta: 'Utilice la opción "Olvidé mi contraseña" en el inicio de sesión.',
    },
  ];

  // Manejo de creación de ticket
  const handleSubmitTicket = (e) => {
    e.preventDefault();
    console.log('Nuevo ticket:', newTicket);
    setNewTicket({
      asunto: '',
      categoria: '',
      descripcion: '',
      prioridad: 'media',
    });
    alert('Ticket enviado. Nuestro equipo se pondrá en contacto contigo.');
  };

  // Manejo de cierre de sesión
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login-usuario');
  };

  // Badges para estados y prioridades
  const renderBadge = (type, value) => {
    const badgeMap = {
      estado: {
        abierto: { bg: 'warning', text: 'Abierto' },
        en_proceso: { bg: 'info', text: 'En Proceso' },
        resuelto: { bg: 'success', text: 'Resuelto' },
      },
      prioridad: {
        alta: { bg: 'danger', text: 'Alta' },
        media: { bg: 'warning', text: 'Media' },
        baja: { bg: 'success', text: 'Baja' },
      },
    };

    const badgeInfo = badgeMap[type]?.[value] || { bg: 'secondary', text: 'Desconocido' };

    return <Badge bg={badgeInfo.bg}>{badgeInfo.text}</Badge>;
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Header className="bg-primary text-light">
            <h2 className="mb-0 text-center">Soporte al Cliente</h2>
          </Card.Header>

          <Card.Body className="p-4">
            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Row>
                {/* Pestañas de Navegación */}
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="tickets" className="text-light d-flex align-items-center">
                        <TicketIcon size={18} className="me-2" /> Mis Tickets
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="nuevo" className="text-light d-flex align-items-center">
                        <Plus size={18} className="me-2" /> Nuevo Ticket
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="faq" className="text-light d-flex align-items-center">
                        <HelpCircle size={18} className="me-2" /> Preguntas Frecuentes
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="contacto" className="text-light d-flex align-items-center">
                        <Phone size={18} className="me-2" /> Contacto Directo
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>

                {/* Contenido de las Pestañas */}
                <Col sm={9}>
                  <Tab.Content>
                    {/* Pestaña de Tickets */}
                    <Tab.Pane eventKey="tickets">
                      <Table hover variant="dark" className="align-middle">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Asunto</th>
                            <th>Categoría</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tickets.map((ticket) => (
                            <tr key={ticket.id}>
                              <td>{ticket.id}</td>
                              <td>{ticket.fecha}</td>
                              <td>{ticket.asunto}</td>
                              <td>{ticket.categoria}</td>
                              <td>{renderBadge('prioridad', ticket.prioridad)}</td>
                              <td>{renderBadge('estado', ticket.estado)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab.Pane>

                    {/* Pestaña Nuevo Ticket */}
                    <Tab.Pane eventKey="nuevo">
                      <Form onSubmit={handleSubmitTicket}>
                        <Form.Group className="mb-3">
                          <Form.Label>Asunto</Form.Label>
                          <Form.Control
                            type="text"
                            className="bg-dark text-light border-secondary"
                            value={newTicket.asunto}
                            onChange={(e) => setNewTicket({ ...newTicket, asunto: e.target.value })}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Categoría</Form.Label>
                          <Form.Select
                            className="bg-dark text-light border-secondary"
                            value={newTicket.categoria}
                            onChange={(e) => setNewTicket({ ...newTicket, categoria: e.target.value })}
                            required
                          >
                            <option value="">Seleccione una categoría</option>
                            <option value="tecnico">Soporte Técnico</option>
                            <option value="pagos">Pagos y Retiros</option>
                            <option value="cuenta">Cuenta de Usuario</option>
                          </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Descripción</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            className="bg-dark text-light border-secondary"
                            value={newTicket.descripcion}
                            onChange={(e) => setNewTicket({ ...newTicket, descripcion: e.target.value })}
                          />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100">
                          <Send size={18} className="me-2" /> Enviar
                        </Button>
                      </Form>
                    </Tab.Pane>

                    {/* Pestaña de FAQ */}
                    <Tab.Pane eventKey="faq">
                      {faqs.map((faq, index) => (
                        <Card key={index} className="mb-3 bg-dark text-light border-secondary">
                          <Card.Header>{faq.pregunta}</Card.Header>
                          <Card.Body>{faq.respuesta}</Card.Body>
                        </Card>
                      ))}
                    </Tab.Pane>

                    {/* Pestaña de Contacto */}
                    <Tab.Pane eventKey="contacto">
                      <Card className="bg-dark text-light border-secondary mb-3">
                        <Card.Body>
                          <h5>
                            <Phone className="me-2" /> Teléfono: +573152728882
                          </h5>
                          <h5>
                            <Mail className="me-2" /> Email: soporte@casinolafortuna.com
                          </h5>
                          <h5>
                            <MapPin className="me-2" /> Dirección: Av. 6 #5-23, Cali
                          </h5>
                          <h5>
                            <Clock className="me-2" /> Horario: 24/7
                          </h5>
                        </Card.Body>
                      </Card>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
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

export default SoporteCliente;