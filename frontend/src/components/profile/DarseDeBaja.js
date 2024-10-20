// src/components/profile/DarseDeBaja.js

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Button, Form, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const DarseDeBaja = () => {
  const [token, setToken] = useState(null);
  const [clienteId, setClienteId] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    const clienteInfo = JSON.parse(localStorage.getItem('clienteInfo'));

    if (!tokenFromStorage || !clienteInfo) {
      navigate('/login-cliente');
    } else {
      setToken(tokenFromStorage);
      setClienteId(clienteInfo.id_cliente);
      setEmail(clienteInfo.correo_electronico);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('clienteInfo');
    navigate('/login-cliente');
  };

  const handleDarseDeBaja = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/clientes/darse-de-baja/${clienteId}`,
        {
          data: { email, password },
          headers: { Authorization: token },
        }
      );

      setMessage({
        type: 'success',
        text: 'Cuenta dada de baja correctamente. Se cerrará la sesión en 3 segundos.',
      });
      setPassword('');

      setTimeout(() => {
        handleLogout();
      }, 3000);
    } catch (error) {
      console.error('Error al dar de baja la cuenta:', error.response?.data || error.message);
      setMessage({
        type: 'danger',
        text: error.response?.data?.error || 'Error al dar de baja la cuenta. Intenta nuevamente.',
      });
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Darse de Baja</h2>

            {message && (
              <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                {message.text}
              </Alert>
            )}

            <Form onSubmit={handleDarseDeBaja}>
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control type="email" value={email} readOnly />
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
                <Button variant="danger" type="submit">
                  Confirmar
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

export default DarseDeBaja;