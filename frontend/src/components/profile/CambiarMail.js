// src/components/profile/CambiarMail.js

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Button, Form, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const CambiarMail = () => {
  const [token, setToken] = useState(null);
  const [clienteId, setClienteId] = useState(null);
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Expresión regular avanzada para validar el email
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Función para convertir a minúsculas y eliminar caracteres especiales no permitidos
  const sanitizeEmail = (value) => {
    return value.toLowerCase().replace(/[^a-z0-9@._-]/g, '');
  };

  // Validación usando la expresión regular
  const validateEmail = (email) => {
    return emailPattern.test(email);
  };

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    const clienteInfo = JSON.parse(localStorage.getItem('clienteInfo'));

    if (!tokenFromStorage || !clienteInfo) {
      navigate('/login-cliente');
    } else {
      setToken(tokenFromStorage);
      setClienteId(clienteInfo.id_cliente);
      setCurrentEmail(clienteInfo.correo_electronico);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('clienteInfo');
    navigate('/login-cliente');
  };

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setMessage(null);

    const sanitizedEmail = sanitizeEmail(newEmail);

    if (!validateEmail(sanitizedEmail)) {
      setMessage({ type: 'danger', text: 'El nuevo correo electrónico no es válido.' });
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/clientes/cambiar-correo/${clienteId}`,
        { currentEmail, newEmail: sanitizedEmail, password },
        {
          headers: { Authorization: token },
        }
      );

      setMessage({
        type: 'success',
        text: 'Correo actualizado correctamente. Se cerrará la sesión en 3 segundos.',
      });
      setNewEmail('');
      setPassword('');

      setTimeout(() => {
        handleLogout();
      }, 3000);
    } catch (error) {
      console.error('Error al cambiar el correo:', error.response?.data || error.message);
      setMessage({
        type: 'danger',
        text: error.response?.data?.error || 'Error al cambiar el correo. Intenta nuevamente.',
      });
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Cambio de Correo Electrónico</h2>

            {message && (
              <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                {message.text}
              </Alert>
            )}

            <Form onSubmit={handleChangeEmail}>
              <Form.Group className="mb-3">
                <Form.Label>Correo Actual</Form.Label>
                <Form.Control type="email" value={currentEmail} readOnly />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nuevo Correo</Form.Label>
                <Form.Control
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(sanitizeEmail(e.target.value))}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="text-center">
                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Cambiar Correo
                </Button>
              </div>
            </Form>

            <div className="mt-4 text-center">
              <Button variant="link" className="text-light" onClick={() => navigate(-1)}>
                Regresar
              </Button>
            </div>
          </Card.Body>
        </Card>

        <div className="mt-4 text-center">
          <Link to="/dashboard-cliente" className="btn btn-outline-primary btn-lg">
            Dashboard
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default CambiarMail;