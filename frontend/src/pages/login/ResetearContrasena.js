// src/pages/login/ResetearContrasena.js

import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, Spinner, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PasswordInput from '../../components/forms/PasswordInput';

const REDIRECT_DELAY = 3000;

const ResetearContrasena = () => {
  const [formData, setFormData] = useState({
    nueva_password: '',
    confirmar_password: '',
  });
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');

    if (!resetToken) {
      setError('No se encontró el token de restablecimiento. Por favor, solicita un nuevo enlace.');
      return;
    }

    setToken(resetToken);
  }, [location.search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let fieldName = name;
    
    if (name === 'nueva_password_confirm') {
      fieldName = 'confirmar_password';
    }
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificamos si el PasswordInput indica que la contraseña es válida
    const passwordInput = e.target.querySelector('[name="nueva_password"]');
    const isPasswordValid = passwordInput.checkValidity() && 
                          passwordInput.classList.contains('is-valid');

    if (!isPasswordValid) {
      setError('La contraseña no cumple con los requisitos de seguridad.');
      return;
    }

    if (formData.nueva_password !== formData.confirmar_password) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/cambiar-password`, {
        token,
        nueva_password: formData.nueva_password,
        confirmar_password: formData.confirmar_password,
      });

      setShowSuccess(true);
      setTimeout(() => {
        navigate('/login-usuario');
      }, REDIRECT_DELAY);

    } catch (err) {
      const errorMessage = err.response?.data?.error || 
        'Ocurrió un error al cambiar la contraseña. Por favor, inténtalo de nuevo.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#000',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '80px',
      paddingBottom: '80px'
    }}>
      <Container style={{ maxWidth: '700px' }}>
        <Card className="shadow-lg text-light mb-4" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body>
            <h2 className="text-center mb-4">Restablecer Contraseña</h2>

            {error && (
              <Alert 
                variant="danger" 
                onClose={() => setError('')} 
                dismissible
                className="mb-4"
              >
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <PasswordInput
                value={formData.nueva_password}
                onChange={handleInputChange}
                confirmValue={formData.confirmar_password}
                onConfirmChange={handleInputChange}
                name="nueva_password"
                label="Nueva Contraseña"
                autoComplete="new-password"
                className="mb-3"
              />

              <div className="d-grid gap-2 mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading || !token}
                  className="py-2"
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Procesando...
                    </>
                  ) : (
                    'Cambiar Contraseña'
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <div className="text-center mt-3">
        <Button
          variant="outline-primary"
          onClick={() => navigate('/login-usuario')}
          className="btn btn-lg px-4 py-2"
        >
          Ir al Login Ahora
        </Button>
      </div>

      <Modal
        show={showSuccess}
        onHide={() => setShowSuccess(false)}
        centered
        backdrop="static"
        keyboard={false}
        size="sm"
      >
        <Alert variant="success" className="m-0">
          <div className="text-center p-3">
            <h5 className="mb-3">¡Contraseña Actualizada!</h5>
            <p className="small mb-3">
              Serás redirigido al inicio de sesión en unos segundos...
            </p>
          </div>
        </Alert>
      </Modal>
    </div>
  );
};

export default ResetearContrasena;