// src/pages/login/RecuperarContrasena.js

import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReCaptcha from '../../components/common/ReCaptcha';
import axios from 'axios';

export default function RecuperarContrasena() {
  const [email, setEmail] = useState('');
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReCaptchaChange = (value) => {
    setRecaptchaValue(value);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!recaptchaValue) {
      setError('Por favor completa el captcha');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/recuperar-password`,
        { email, recaptcha: recaptchaValue }
      );
      setMessage(response.data.message || 'Correo enviado. Revisa tu bandeja de entrada.');
      setEmail(''); // Limpiar el campo después de un envío exitoso
    } catch (err) {
      setError(err.response?.data?.error || 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#000',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '80px',
      paddingBottom: '80px'
    }}>
      <Container className="d-flex justify-content-center">
        <Card style={{ width: '100%', maxWidth: '400px', backgroundColor: '#141414' }} className="p-4 shadow">
          <Card.Body>
            <h2 className="text-center mb-4 text-light">Recuperar Contraseña</h2>

            {message && (
              <Alert variant="success" onClose={() => setMessage(null)} dismissible>
                {message}
              </Alert>
            )}

            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label className="text-light">Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="bg-dark text-light"
                  placeholder="ejemplo@correo.com"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <ReCaptcha onChange={handleReCaptchaChange} />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="mb-3"
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Enviando...
                    </>
                  ) : (
                    'Recuperar Contraseña'
                  )}
                </Button>
              </div>
            </Form>

            <Row className="mt-4">
              <Col className="text-center">
                <p className="text-light">
                  ¿Ya recordaste tu contraseña? <Link to="/login-usuario" className="text-primary">Iniciar Sesión</Link>
                </p>
                <p className="text-light">
                  ¿Aún no tienes una cuenta? <Link to="/registro-usuario" className="text-primary">Registrarse</Link>
                </p>
                <p className="text-light">
                  <Link to="/" className="text-secondary">Volver al inicio</Link>
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}