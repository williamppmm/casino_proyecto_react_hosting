import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResetearContrasena() {
  const [form, setForm] = useState({
    nueva_password: '',
    confirmar_password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  useEffect(() => {
    // Extraer token de la URL
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (!tokenFromUrl) {
      setError('Token no proporcionado. Por favor, solicita nuevamente el cambio de contraseña.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.nueva_password !== form.confirmar_password) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/cambiar-password`, {
        token,
        nueva_password: form.nueva_password,
        confirmar_password: form.confirmar_password,
      });
      setShowSuccessModal(true); // Mostrar el modal de éxito

      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/login-usuario'); // Redirigir a la página de inicio de sesión
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar la contraseña.');
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
            <h2 className="text-center mb-4 text-light">Restablecer Contraseña</h2>

            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="nueva_password" className="mb-3">
                <Form.Label className="text-light">Nueva Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="nueva_password"
                  value={form.nueva_password}
                  onChange={handleChange}
                  required
                  className="bg-dark text-light"
                  placeholder="Nueva contraseña"
                />
              </Form.Group>

              <Form.Group controlId="confirmar_password" className="mb-4">
                <Form.Label className="text-light">Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmar_password"
                  value={form.confirmar_password}
                  onChange={handleChange}
                  required
                  className="bg-dark text-light"
                  placeholder="Confirma tu contraseña"
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !token}
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
                      Cambiando...
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

      {/* Modal de Éxito */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
        backdrop="static"
        keyboard={false}
        aria-labelledby="success-modal"
      >
        <Modal.Header style={{ backgroundColor: '#d4edda', borderBottom: '1px solid #c3e6cb' }}>
          <Modal.Title id="success-modal" style={{ color: '#155724' }}>
            ¡Contraseña Actualizada!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#d4edda', color: '#155724' }}>
          <div className="text-center">
            <i className="bi bi-check-circle-fill h1"></i>
            <p className="mt-3">Tu contraseña ha sido cambiada exitosamente.</p>
            <p className="mb-0">Serás redirigido a la página de inicio de sesión en unos momentos...</p>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}