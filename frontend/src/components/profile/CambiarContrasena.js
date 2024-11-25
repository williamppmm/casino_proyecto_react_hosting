import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate, Link } from 'react-router-dom';
import { cambiarContrasena } from '../../services/api';

const PASSWORD_REQUIREMENTS = [
  { 
    regex: /.{8,}/, 
    text: 'Mínimo 8 caracteres' 
  },
  { 
    regex: /(?=.*[A-ZÑ])|(?=.*[ÁÉÍÓÚÜ])/, 
    text: 'Al menos una letra mayúscula' 
  },
  { 
    regex: /(?=.*[a-zñ])|(?=.*[áéíóúü])/, 
    text: 'Al menos una letra minúscula' 
  },
  { 
    regex: /[0-9]/, 
    text: 'Al menos un número' 
  },
  { 
    regex: /[!@#$%^&*¡¿]/, 
    text: 'Al menos un carácter especial (!@#$%^&*¡¿)' 
  },
];

const CambiarContrasena = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRequirements, setShowRequirements] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState(
    PASSWORD_REQUIREMENTS.map((req) => ({ ...req, fulfilled: false }))
  );
  const [passwordVisible, setPasswordVisible] = useState({ current: false, new: false, confirm: false });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login-usuario');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validatePassword(newPassword)) {
      setMessage({ type: 'danger', text: 'La nueva contraseña no cumple con los requisitos.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'danger', text: 'Las contraseñas no coinciden.' });
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
    }
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

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña Actual</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={passwordVisible.current ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => setPasswordVisible((prev) => ({ ...prev, current: !prev.current }))}
                  >
                    {passwordVisible.current ? <BsEyeSlash /> : <BsEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

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

              <div className="d-flex justify-content-between gap-3">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading} 
                  className="flex-grow-1"
                >
                  {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
                <Button
                  as={Link}
                  to="/perfil-cliente"
                  variant="outline-secondary"
                  type="button"
                  className="px-4"
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
            type="button"
            className="px-4 py-2 me-2"
            onClick={() => navigate('/perfil-cliente')}
          >
            Perfil
          </Button>
          <Button
            variant="outline-secondary"
            type="button"
            className="px-4 py-2 me-2"
            onClick={() => navigate('/dashboard-cliente')}
          >
            Dashboard
          </Button>
          <Button
            variant="outline-danger"
            type="button"
            className="px-4 py-2"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default CambiarContrasena;