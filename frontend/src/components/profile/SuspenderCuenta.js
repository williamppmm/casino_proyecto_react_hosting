import React, { useState, useCallback } from 'react';
import { Container, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { suspenderCuenta } from '../../services/api';
import { Home, LogOut } from 'lucide-react';

const SuspenderCuenta = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
    motivo: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState({
    loading: false,
    message: null,
    success: false,
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    // Restricción para longitud máxima del motivo
    if (name === 'motivo' && value.length > 255) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleOpenModal = useCallback(() => {
    setStatus((prev) => ({ ...prev, message: null }));

    if (!formData.correo || !formData.motivo) {
      setStatus((prev) => ({
        ...prev,
        message: { type: 'danger', text: 'Correo y motivo son obligatorios.' },
      }));
      return;
    }

    setShowModal(true);
  }, [formData.correo, formData.motivo]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setFormData((prev) => ({ ...prev, password: '' }));
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.clear();
    navigate('/login-usuario');
  }, [navigate]);

  const handleConfirm = async () => {
    if (!formData.password) {
      setStatus((prev) => ({
        ...prev,
        message: { type: 'danger', text: 'La contraseña es obligatoria.' },
      }));
      return;
    }

    try {
      setStatus({ loading: true, message: null, success: false });

      await suspenderCuenta(formData);
      handleCloseModal();

      setStatus({
        loading: false,
        message: {
          type: 'success',
          text: 'Cuenta suspendida exitosamente. Cerrando sesión...',
        },
        success: true,
      });

      setTimeout(handleLogout, 3000);
    } catch (error) {
      setStatus({
        loading: false,
        message: {
          type: 'danger',
          text: error?.message || 'Error al suspender la cuenta.',
        },
        success: false,
      });
    }
  };

  const navigateTo = useCallback((path) => () => navigate(path), [navigate]);

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container style={{ maxWidth: '500px' }}>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Suspender Cuenta</h2>

            {status.message && (
              <Alert
                variant={status.message.type}
                onClose={() => setStatus((prev) => ({ ...prev, message: null }))}
                dismissible
              >
                {status.message.text}
              </Alert>
            )}

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  placeholder="Ingrese su correo electrónico"
                  disabled={status.loading || status.success}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Motivo de Suspensión</Form.Label>
                <Form.Control
                  as="textarea"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleInputChange}
                  placeholder="Ej. Suspensión temporal por viaje al extranjero"
                  rows={3}
                  disabled={status.loading || status.success}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between gap-3">
                <Button
                  variant="warning"
                  className="flex-grow-1"
                  onClick={handleOpenModal}
                  disabled={status.loading || status.success}
                >
                  {status.loading ? 'Procesando...' : 'Suspender Cuenta'}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="px-4"
                  onClick={navigateTo('/perfil-cliente')}
                  disabled={status.loading}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <div className="mt-4 text-center">
          <Button
            variant="outline-primary"
            className="btn btn-outline-primary px-4 py-2 me-2"
            onClick={navigateTo('/dashboard-cliente')}
            disabled={status.loading}
          >
            <Home size={18} className="me-2" /> Dashboard
          </Button>
          <Button
            variant="outline-danger"
            className="btn btn-outline-danger px-4 py-2"
            onClick={handleLogout}
            disabled={status.loading}
          >
            <LogOut size={18} className="me-2" /> Cerrar Sesión
          </Button>
        </div>
      </Container>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        style={{ color: 'black' }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.5rem' }}>Confirmar Suspensión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: '1rem' }}>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Ingrese su contraseña para confirmar"
              required
              style={{ fontSize: '1rem' }}
              autoComplete="off"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-light px-4 py-2"
            onClick={handleCloseModal}
            style={{ fontSize: '1rem' }}
            disabled={status.loading}
          >
            Cancelar
          </Button>
          <Button
            className="btn btn-primary px-4 py-2"
            onClick={handleConfirm}
            style={{ fontSize: '1rem' }}
            disabled={status.loading}
          >
            {status.loading ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Procesando...
              </span>
            ) : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SuspenderCuenta;