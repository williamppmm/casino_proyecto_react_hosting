// src components/profile/CambiarContrasena.js

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Button, Form, Alert, Card, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { BsEye, BsEyeSlash } from "react-icons/bs";

const CambiarContrasena = () => {
  const [token, setToken] = useState(null);
  const [clienteId, setClienteId] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    const clienteInfo = JSON.parse(localStorage.getItem('clienteInfo'));

    if (!tokenFromStorage || !clienteInfo) {
      navigate('/login-cliente');
    } else {
      setToken(tokenFromStorage);
      setClienteId(clienteInfo.id_cliente);
      console.log("Token almacenado:", tokenFromStorage);
      console.log("ID del cliente almacenado:", clienteInfo.id_cliente);
    }
  }, [navigate]);

  const validatePassword = (password) => {
    if (!passwordRegex.test(password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('clienteInfo');
    navigate('/login-cliente');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validatePassword(newPassword)) {
      return;
    }

    try {
      console.log("Token enviado:", token);
      console.log("ID cliente enviado:", clienteId);

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/clientes/cambiar-contrasena/${clienteId}`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: token }
        }
      );

      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente. Se cerrará la sesión en 3 segundos.' });
      setCurrentPassword('');
      setNewPassword('');
      
      setTimeout(() => {
        handleLogout();
      }, 3000);
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error.response?.data || error.message);
      setMessage({ type: 'danger', text: error.response?.data?.error || 'Error al cambiar la contraseña. Intenta nuevamente.' });
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Cambiar Contraseña</h2>

            {message && (
              <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                {message.text}
              </Alert>
            )}

            <Form onSubmit={handleChangePassword}>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña Actual</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <Button variant="outline-secondary" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    {showCurrentPassword ? <BsEyeSlash /> : <BsEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nueva Contraseña</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    required
                  />
                  <Button variant="outline-secondary" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                  </Button>
                </InputGroup>
                {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
              </Form.Group>

              <div className="text-center">
                <Button variant="primary" type="submit" className="w-100 mb-3">
                  Cambiar Contraseña
                </Button>
              </div>
            </Form>

            <div className="mt-4 text-center">
              <Button variant="link" className="text-light" onClick={() => navigate(-1)}>
                Regresar
              </Button>
            </div>
          </Card.Body>
        </Card>

        <div className="mt-4 text-center">
          <Link to="/dashboard-cliente" className="btn btn-outline-primary btn-lg">
            Dashboard
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default CambiarContrasena;