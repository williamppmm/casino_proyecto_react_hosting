// src/pages/login/LoginUsuario.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import axios from 'axios';

export default function LoginUsuario() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    correo_electronico: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);

  useEffect(() => {
    // Verificar si ya hay una sesión activa
    const token = sessionStorage.getItem('token');
    const dashboardUrl = sessionStorage.getItem('dashboard_url');
    if (token && dashboardUrl) {
      navigate(dashboardUrl);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/login-usuario`,
        credentials
      );

      const { token, tipo, nombre, dashboard_url } = response.data;

      // Guardar datos de sesión
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user_type', tipo);
      sessionStorage.setItem('user_name', nombre);
      sessionStorage.setItem('dashboard_url', dashboard_url);

      // Configurar token para futuras peticiones
      axios.defaults.headers.common['Authorization'] = token;

      // Redirigir al dashboard correspondiente
      const redirectTo = sessionStorage.getItem('redirectTo');
      navigate(redirectTo || dashboard_url);
      sessionStorage.removeItem('redirectTo');

    } catch (err) {
      console.error('Error de login:', err);
      setError(err.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
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
            <h2 className="text-center mb-4 text-light">Iniciar Sesión</h2>

            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="correo_electronico" className="mb-3">
                <Form.Label className="text-light">Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="correo_electronico"
                  value={credentials.correo_electronico}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="bg-dark text-light"
                  placeholder="ejemplo@correo.com"
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-4">
                <Form.Label className="text-light">Contraseña</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="bg-dark text-light"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                  </Button>
                </div>
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
                      Iniciando sesión...
                    </>
                  ) : (
                    'Ingresar'
                  )}
                </Button>
              </div>
            </Form>
            <Row className="mt-4">
              <Col className="text-center">
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