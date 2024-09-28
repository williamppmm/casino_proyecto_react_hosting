// src/components/perfil/CambiarContrasena.js

// src/components/perfil/CambiarContrasena.js

import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { cambiarContrasena } from '../../services/api';

const CambiarContrasena = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las nuevas contraseñas no coinciden');
      return false;
    }
    if (formData.newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const clienteId = localStorage.getItem('clienteId');
      if (!clienteId) {
        throw new Error('No se encontró el ID del cliente');
      }

      const response = await cambiarContrasena(clienteId, formData.currentPassword, formData.newPassword);
      setSuccess(response.message || 'Contraseña actualizada correctamente');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form.Group className="mb-3" controlId="currentPassword">
        <Form.Label>Contraseña actual</Form.Label>
        <Form.Control
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="newPassword">
        <Form.Label>Nueva contraseña</Form.Label>
        <Form.Control
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="confirmPassword">
        <Form.Label>Confirmar nueva contraseña</Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            {' Cambiando...'}
          </>
        ) : (
          'Cambiar contraseña'
        )}
      </Button>
    </Form>
  );
};

export default CambiarContrasena;