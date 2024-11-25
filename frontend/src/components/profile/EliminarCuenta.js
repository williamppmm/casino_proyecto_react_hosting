import React, { useState, useCallback } from 'react';
import { Container, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { eliminarCuenta } from '../../services/api';

const EliminarCuenta = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
    obtenerCopia: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState({
    loading: false,
    message: null,
    success: false,
    respaldo: null,
  });

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleOpenModal = useCallback(() => {
    setStatus((prev) => ({ ...prev, message: null }));

    if (!formData.correo) {
      setStatus((prev) => ({
        ...prev,
        message: { type: 'danger', text: 'El correo es obligatorio.' },
      }));
      return;
    }

    setShowModal(true);
  }, [formData.correo]);

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

      const response = await eliminarCuenta(formData);
      handleCloseModal();

      setStatus({
        loading: false,
        message: {
          type: 'success',
          text: 'Cuenta eliminada exitosamente. Cerrando sesión...',
        },
        success: true,
        respaldo: formData.obtenerCopia ? response.respaldo : null,
      });

      setTimeout(handleLogout, 3000);
    } catch (error) {
      setStatus({
        loading: false,
        message: {
          type: 'danger',
          text: error?.message || 'Error al eliminar la cuenta.',
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
            <h2 className="text-center mb-4">Eliminar Cuenta</h2>

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
                <Form.Check
                  type="checkbox"
                  name="obtenerCopia"
                  label="Solicitar respaldo de mis datos personales"
                  checked={formData.obtenerCopia}
                  onChange={handleInputChange}
                  disabled={status.loading || status.success}
                />
              </Form.Group>

              <div className="d-flex justify-content-between gap-3">
                <Button
                  variant="danger"
                  className="flex-grow-1"
                  onClick={handleOpenModal}
                  disabled={status.loading || status.success}
                >
                  {status.loading ? 'Procesando...' : 'Eliminar Cuenta'}
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
            onClick={navigateTo('/perfil-cliente')}
            disabled={status.loading}
          >
            Perfil
          </Button>
          <Button
            variant="outline-secondary"
            className="btn btn-outline-secondary px-4 py-2 me-2"
            onClick={navigateTo('/dashboard-cliente')}
            disabled={status.loading}
          >
            Dashboard
          </Button>
          <Button
            variant="outline-danger"
            className="btn btn-outline-danger px-4 py-2"
            onClick={handleLogout}
            disabled={status.loading}
          >
            Cerrar Sesión
          </Button>
        </div>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} centered style={{ color: 'black' }}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.5rem' }}>Confirmar Eliminación</Modal.Title>
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
            className="btn btn-danger px-4 py-2"
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

export default EliminarCuenta;