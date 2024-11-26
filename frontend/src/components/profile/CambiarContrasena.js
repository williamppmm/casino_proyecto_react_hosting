import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { cambiarContrasena } from '../../services/api';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { Home, LogOut } from 'lucide-react';

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: 'Mínimo 8 caracteres' },
  { regex: /(?=.*[A-ZÑ])|(?=.*[ÁÉÍÓÚÜ])/, text: 'Al menos una letra mayúscula' },
  { regex: /(?=.*[a-zñ])|(?=.*[áéíóúü])/, text: 'Al menos una letra minúscula' },
  { regex: /[0-9]/, text: 'Al menos un número' },
  { regex: /[!@#$%^&*¡¿]/, text: 'Al menos un carácter especial (!@#$%^&*¡¿)' },
];

const CambiarContrasena = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState(
    PASSWORD_REQUIREMENTS.map((req) => ({ ...req, fulfilled: false }))
  );
  const [passwordVisible, setPasswordVisible] = useState({ new: false, confirm: false });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

  const validatePassword = (password) => {
    const updatedRequirements = PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      fulfilled: req.regex.test(password),
    }));
    setPasswordRequirements(updatedRequirements);
    return updatedRequirements.every((req) => req.fulfilled);
  };

  useEffect(() => {
    setShowRequirements(!validatePassword(newPassword) && newPassword.length > 0);
  }, [newPassword]);

  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
    validatePassword(value);
  };

  const handleOpenModal = () => {
    if (!validatePassword(newPassword)) {
      setMessage({ type: 'danger', text: 'La nueva contraseña no cumple con los requisitos.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'danger', text: 'Las contraseñas no coinciden.' });
      return;
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPassword('');
  };

  const handleConfirm = async () => {
    if (!currentPassword) {
      setMessage({ type: 'danger', text: 'Debe ingresar su contraseña actual para confirmar.' });
      return;
    }

    try {
      setLoading(true);
      await cambiarContrasena({
        passwordActual: currentPassword,
        nuevaPassword: newPassword,
        confirmarPassword: confirmPassword,
      });
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente. Redirigiendo...' });
      setTimeout(() => navigate('/perfil-cliente'), 3000);
    } catch (error) {
      setMessage({ type: 'danger', text: error?.message || 'Error al cambiar la contraseña.' });
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login-usuario');
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container style={{ maxWidth: '500px' }}>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Cambiar Contraseña</h2>

            {message && (
              <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                {message.text}
              </Alert>
            )}

            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nueva Contraseña</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={passwordVisible.new ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => handleNewPasswordChange(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => setPasswordVisible((prev) => ({ ...prev, new: !prev.new }))}
                  >
                    {passwordVisible.new ? <BsEyeSlash /> : <BsEye />}
                  </Button>
                </InputGroup>
                {showRequirements && (
                  <div className="password-requirements mt-2">
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center"
                        style={{
                          fontSize: '0.85rem',
                          color: req.fulfilled ? '#28a745' : '#dc3545',
                          marginBottom: '0.2rem',
                        }}
                      >
                        <i
                          className={`me-2 ${req.fulfilled ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}
                          style={{ fontSize: '1rem' }}
                        ></i>
                        {req.text}
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={passwordVisible.confirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => setPasswordVisible((prev) => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {passwordVisible.confirm ? <BsEyeSlash /> : <BsEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <div className="d-flex justify-content-center gap-3">
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleOpenModal}
                  disabled={loading}
                  className="flex-grow-1"
                >
                  {loading ? 'Cambiando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

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
              <Form.Label style={{ fontSize: '1rem' }}>Contraseña Actual</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingrese su contraseña para confirmar"
                required
                style={{ fontSize: '1rem' }}
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
              {loading ? 'Cambiando...' : 'Confirmar'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Botones adicionales */}
        <div className="mt-4 text-center">
          <Button
            variant="outline-primary"
            type="button"
            className="px-4 py-2 me-2"
            onClick={() => navigate('/dashboard-cliente')}
          >
            <Home size={18} className="me-2" /> Dashboard
          </Button>
          <Button
            variant="outline-danger"
            type="button"
            className="px-4 py-2"
            onClick={handleLogout}
          >
            <LogOut size={18} className="me-2" /> Cerrar Sesión
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default CambiarContrasena;