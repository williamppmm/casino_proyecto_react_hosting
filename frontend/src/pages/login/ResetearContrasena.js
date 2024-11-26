import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: 'Mínimo 8 caracteres' },
  { regex: /(?=.*[A-ZÑ])|(?=.*[ÁÉÍÓÚÜ])/, text: 'Al menos una letra mayúscula' },
  { regex: /(?=.*[a-zñ])|(?=.*[áéíóúü])/, text: 'Al menos una letra minúscula' },
  { regex: /[0-9]/, text: 'Al menos un número' },
  { regex: /[!@#$%^&*¡¿]/, text: 'Al menos un carácter especial (!@#$%^&*¡¿)' },
];

const ResetearContrasena = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState(
    PASSWORD_REQUIREMENTS.map((req) => ({ ...req, fulfilled: false }))
  );
  const [passwordVisible, setPasswordVisible] = useState({ new: false, confirm: false });
  const [showRequirements, setShowRequirements] = useState(true);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  // Validar contraseña nueva
  const validatePassword = (password) => {
    const updatedRequirements = PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      fulfilled: req.regex.test(password),
    }));
    setPasswordRequirements(updatedRequirements);
    return updatedRequirements.every((req) => req.fulfilled);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    if (!resetToken) {
      setMessage({ type: 'danger', text: 'Token no válido. Solicita un nuevo enlace para restablecer tu contraseña.' });
    }
    setToken(resetToken);
  }, [location.search]);

  useEffect(() => {
    // Mostrar requisitos solo si la contraseña no cumple todas las validaciones
    const allValid = validatePassword(newPassword);
    setShowRequirements(!allValid && newPassword.length > 0);
  }, [newPassword]);

  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/cambiar-password`, {
        token,
        nueva_password: newPassword,
        confirmar_password: confirmPassword,
      });
      setMessage({ type: 'success', text: 'Contraseña restablecida correctamente. Redirigiendo...' });
      setTimeout(() => navigate('/login-usuario'), 3000);
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.error || 'Error al restablecer la contraseña. Inténtalo de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container style={{ maxWidth: '400px' }}>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Restablecer Contraseña</h2>

            {message && (
              <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                {message.text}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
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

              <div className="d-grid gap-2 mt-4">
                <Button type="submit" variant="primary" disabled={loading || !token} className="py-2">
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Procesando...
                    </>
                  ) : (
                    'Restablecer Contraseña'
                  )}
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
            onClick={() => navigate('/login-usuario')}
          >
            Ir al Login
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default ResetearContrasena;