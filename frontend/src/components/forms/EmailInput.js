// src/components/forms/EmailInput.js

import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const EmailInput = ({ email, confirmEmail, onEmailChange, onConfirmEmailChange }) => {
  // Función para convertir a minúsculas y eliminar caracteres especiales
  const sanitizeEmail = (value) => {
    return value.toLowerCase().replace(/[^a-z0-9@._-]/g, '');
  };

  // Expresión regular simplificada
  const isValidEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
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
        <Form.Group>
          <Form.Label htmlFor="email">Correo Electrónico</Form.Label>  {/* Usamos solo htmlFor */}
          <Form.Control
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            isValid={isEmailValid && email.length > 0}
            isInvalid={!isEmailValid && email.length > 0}
            required
            autoComplete="email"
          />
          <Form.Control.Feedback type="invalid">
            Por favor, ingrese un correo electrónico válido.
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group>
          <Form.Label htmlFor="confirmEmail">Confirmar Correo Electrónico</Form.Label>
          <Form.Control
            id="confirmEmail"
            type="email"
            value={confirmEmail}
            onChange={handleConfirmEmailChange}
            isValid={emailsMatch && confirmEmail.length > 0}
            isInvalid={!emailsMatch && confirmEmail.length > 0}
            required
            autoComplete="email"
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