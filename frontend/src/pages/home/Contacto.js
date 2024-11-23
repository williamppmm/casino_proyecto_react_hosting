import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Contacto = () => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    asunto: '',
    mensaje: '',
  });

  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Mensaje de contacto enviado:', formData);
    // Reiniciar el formulario
    setFormData({ asunto: '', mensaje: '' });
    alert('Mensaje enviado. Nuestro equipo se pondrá en contacto contigo pronto.');
  };

  return (
    <section
      className="contacto-section py-5"
      style={{ backgroundColor: '#141414', color: '#fff', minHeight: '100vh', marginTop: '0px' }}
    >
      <Container>
        <h1 className="text-center mb-5" style={{ color: '#fff', fontWeight: 'bold' }}>
          Contacto
        </h1>
        <Row>
          <Col md={6}>
            <Card bg="dark" text="white" className="mb-4">
              <Card.Header>Formulario de Contacto</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="asunto">
                    <Form.Label>Asunto</Form.Label>
                    <Form.Control
                      type="text"
                      name="asunto"
                      value={formData.asunto}
                      onChange={handleChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                  <Form.Group controlId="mensaje">
                    <Form.Label>Mensaje</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      className="bg-dark text-white"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100 mt-3">
                    Enviar Mensaje
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <Row className="text-center mt-4">
              <Col>
                <p className="text-light">
                  ¿Ya eres cliente?{' '}
                  <Link to="/login-usuario" className="text-primary">
                    Inicia sesión aquí
                  </Link>
                </p>
              </Col>
            </Row>
          </Col>

          <Col md={6}>
            <Card bg="dark" text="white" className="mb-4">
              <Card.Header>Información de Contacto</Card.Header>
              <Card.Body>
                <Card.Text>
                  <p className="mb-2">
                    <Phone className="inline-block mr-2" size={18} />
                    <strong>Teléfono:</strong> +573152728882
                  </p>
                  <p className="mb-2">
                    <Mail className="inline-block mr-2" size={18} />
                    <strong>Email:</strong> contacto@casinolafortuna.com
                  </p>
                  <p className="mb-2">
                    <MapPin className="inline-block mr-2" size={18} />
                    <strong>Dirección:</strong> Av.6 #5-23 Santiago de Cali
                  </p>
                  <p className="mb-2">
                    <Clock className="inline-block mr-2" size={18} />
                    <strong>Horario de atención:</strong> Lunes a Domingo, 24 horas
                  </p>
                </Card.Text>
              </Card.Body>
            </Card>

            <Card bg="dark" text="white" className="mt-4">
              <Card.Header>Encuéntranos</Card.Header>
              <Card.Body>
                <div id="map-container">
                  <iframe
                    title="Ubicación en el mapa"
                    src="https://maps.google.com/maps?q=Av.6%20%235-23%20Santiago%20de%20Cali&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    frameBorder="0"
                    style={{ border: 0, width: '100%', height: '250px' }}
                    allowFullScreen
                  ></iframe>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
      </Container>
    </section>
  );
};

export default Contacto;