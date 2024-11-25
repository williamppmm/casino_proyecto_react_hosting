// src/components/forms/EmailInput.js

import React, { useEffect, useCallback, useMemo } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const EmailInput = ({
  email,
  confirmEmail,
  onEmailChange,
  onConfirmEmailChange,
  onValidationChange,
  disabled = false,
  required = true,
}) => {
  // Regex para validación de email (no permite ñ ni acentos)
  const emailPattern = useMemo(() => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, []);

  const validateEmailFormat = useCallback((email) => {
    if (!email) return false;
    return emailPattern.test(email);
  }, [emailPattern]);

  const sanitizeEmail = useCallback((value) => {
    // Eliminar espacios y convertir a minúsculas
    let sanitized = value.toLowerCase().trim();
    // Eliminar caracteres no permitidos (ñ, acentos y otros caracteres especiales)
    sanitized = sanitized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Solo permitir caracteres válidos para email
    sanitized = sanitized.replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~@-]/g, '');
    return sanitized;
  }, []);

  // Memoizar los resultados de validación
  const validationResult = useMemo(() => {
    const isEmailValid = validateEmailFormat(email);
    const emailsMatch = email === confirmEmail;
    
    return {
      isValid: isEmailValid && (!confirmEmail || emailsMatch),
      error: !isEmailValid ? 'Por favor, ingrese un correo electrónico válido' : 
             !emailsMatch && confirmEmail ? 'Los correos electrónicos no coinciden' : null
    };
  }, [email, confirmEmail, validateEmailFormat]);

  const handleEmailChange = useCallback((e) => {
    const sanitizedValue = sanitizeEmail(e.target.value);
    onEmailChange(sanitizedValue);
  }, [sanitizeEmail, onEmailChange]);

  const handleConfirmEmailChange = useCallback((e) => {
    const sanitizedValue = sanitizeEmail(e.target.value);
    onConfirmEmailChange(sanitizedValue);
  }, [sanitizeEmail, onConfirmEmailChange]);

  // Notificar cambios en la validación
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validationResult);
    }
  }, [validationResult, onValidationChange]);

  return (
    <Row>
      <Col md={6}>
        <Form.Group controlId="email">
          <Form.Label>
            Correo Electrónico {required && <span className="text-danger">*</span>}
          </Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={handleEmailChange}
            isValid={validationResult.isValid && email.length > 0}
            isInvalid={!validationResult.isValid && email.length > 0}
            disabled={disabled}
            required={required}
            placeholder="correo@ejemplo.com"
            autocomplete="off"
          />
          <Form.Control.Feedback type="invalid">
            Por favor, ingrese un correo electrónico válido
          </Form.Control.Feedback>
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group controlId="confirmEmail">
          <Form.Label>
            Confirmar Correo Electrónico {required && <span className="text-danger">*</span>}
          </Form.Label>
          <Form.Control
            type="email"
            value={confirmEmail}
            onChange={handleConfirmEmailChange}
            isValid={validationResult.isValid && confirmEmail.length > 0}
            isInvalid={!validationResult.isValid && confirmEmail.length > 0}
            disabled={disabled || !email || !validateEmailFormat(email)}
            required={required}
            placeholder="correo@ejemplo.com"
            autocomplete="off"
          />
          <Form.Control.Feedback type="invalid">
            Los correos electrónicos no coinciden
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default EmailInput;