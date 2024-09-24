// src/components/forms/EmailInput.js

import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const EmailInput = ({ email, confirmEmail, onEmailChange, onConfirmEmailChange }) => {
  // Función para convertir a minúsculas y eliminar caracteres especiales
  const sanitizeEmail = (value) => {
    return value.toLowerCase().replace(/[^a-z0-9@._-]/g, '');
  };

  // Validar el formato del correo electrónico
  const isValidEmail = (email) => {
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const sanitizedValue = sanitizeEmail(e.target.value);
    onEmailChange(sanitizedValue);
  };

  const handleConfirmEmailChange = (e) => {
    const sanitizedValue = sanitizeEmail(e.target.value);
    onConfirmEmailChange(sanitizedValue);
  };

  const emailsMatch = email === confirmEmail;
  const isEmailValid = isValidEmail(email);

  return (
    <Row>
      <Col md={6}>
        <Form.Group controlId="email">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={handleEmailChange}
            isValid={isEmailValid && email.length > 0}
            isInvalid={!isEmailValid && email.length > 0}
            required
          />
          <Form.Control.Feedback type="invalid">
            Por favor, ingrese un correo electrónico válido.
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group controlId="confirmEmail">
          <Form.Label>Confirmar Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            value={confirmEmail}
            onChange={handleConfirmEmailChange}
            isValid={emailsMatch && confirmEmail.length > 0}
            isInvalid={!emailsMatch && confirmEmail.length > 0}
            required
          />
          <Form.Control.Feedback type="invalid">
            Los correos electrónicos no coinciden.
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default EmailInput;