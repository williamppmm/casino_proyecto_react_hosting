import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { cambiarCorreo } from '../../services/api';
import EmailInput from '../forms/EmailInput';

const CambiarCorreo = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [validation, setValidation] = useState({ isValid: false, error: null });
  const [loading, setLoading] = useState(false);

  const handleValidationChange = (result) => {
    setValidation(result);
  };

  const handleOpenModal = () => {
    if (!validation.isValid) {
      setMessage({ type: 'danger', text: validation.error });
      return;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPassword('');
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login-usuario');
  };

  const handleConfirm = async () => {
    if (!password) {
      setMessage({ type: 'danger', text: 'Debe ingresar su contraseña para confirmar.' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await cambiarCorreo({ nuevoCorreo: email, confirmarCorreo: confirmEmail, passwordActual: password });

      setMessage({ type: 'success', text: 'Correo electrónico actualizado correctamente. Cerrando sesión...' });

      setTimeout(() => {
        handleLogout();
      }, 3000);
    } catch (error) {
      setMessage({ type: 'danger', text: error?.message || 'Error al cambiar el correo.' });
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container style={{ maxWidth: '500px' }}>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Cambiar Correo Electrónico</h2>

            {message && (
              <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                {message.text}
              </Alert>
            )}

            <Form>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <Form.Group>
                  <Form.Label className="text-light">Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingrese su nuevo correo electrónico"
                    required
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label className="text-light">Confirmar Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder="Confirme su nuevo correo electrónico"
                    required
                  />
                </Form.Group>
              </div>

              {/* Componente EmailInput oculto para mantener la validación */}
              <div style={{ display: 'none' }}>
                <EmailInput
                  email={email}
                  confirmEmail={confirmEmail}
                  onEmailChange={setEmail}
                  onConfirmEmailChange={setConfirmEmail}
                  onValidationChange={handleValidationChange}
                />
              </div>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={handleOpenModal}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Link
                  to="/perfil-cliente"
                  className="btn btn-outline-secondary px-4 py-2"
                  style={{ fontSize: '1rem' }}
                >
                  Cancelar
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Botones adicionales */}
        <div className="mt-4 text-center">
          <Button
            variant="outline-primary"
            className="btn btn-outline-primary px-4 py-2 me-2"
            onClick={() => navigate('/perfil-cliente')}
            style={{ fontSize: '1rem' }}
          >
            Perfil
          </Button>
          <Button
            variant="outline-secondary"
            className="btn btn-outline-secondary px-4 py-2 me-2"
            onClick={() => navigate('/dashboard-cliente')}
            style={{ fontSize: '1rem' }}
          >
            Dashboard
          </Button>
          <Button
            variant="outline-danger"
            className="btn btn-outline-danger px-4 py-2"
            onClick={handleLogout}
            style={{ fontSize: '1rem' }}
          >
            Cerrar Sesión
          </Button>
        </div>
      </Container>

      {/* Modal de Confirmación */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        style={{ color: 'black' }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.5rem' }}>Confirmar Cambios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: '1rem' }}>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña para confirmar"
              required
              style={{ fontSize: '1rem' }}
              autoComplete="off"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-light px-4 py-2" onClick={handleCloseModal} style={{ fontSize: '1rem' }}>
            Cancelar
          </Button>
          <Button
            className="btn btn-primary px-4 py-2"
            onClick={handleConfirm}
            style={{ fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CambiarCorreo;