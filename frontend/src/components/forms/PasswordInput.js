// src/components/forms/PasswordInput.js

import React, { useState } from 'react';
import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from "react-icons/bs";

const PasswordInput = ({ value, onChange, confirmValue, onConfirmChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Regex para validación de contraseña
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  // Validar la contraseña
  const isPasswordValid = passwordRegex.test(value);
  const doPasswordsMatch = value === confirmValue;

  return (
    <Row>
      <Col md={6}>
        <Form.Group controlId="user_pass">
          <Form.Label>Contraseña</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="user_pass"
              value={value}
              onChange={onChange}
              required
              isValid={isPasswordValid}
              isInvalid={value && !isPasswordValid}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BsEyeSlash /> : <BsEye />}
            </Button>
          </InputGroup>
          <Form.Text className="text-muted">
            La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y un carácter especial.
          </Form.Text>
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group controlId="confirm_user_pass">
          <Form.Label>Confirmar Contraseña</Form.Label>
          <InputGroup>
            <Form.Control
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_user_pass"
              value={confirmValue}
              onChange={onConfirmChange}
              required
              isValid={confirmValue && doPasswordsMatch}
              isInvalid={confirmValue && !doPasswordsMatch}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
            </Button>
          </InputGroup>
          {confirmValue && !doPasswordsMatch && (
            <Form.Text className="text-danger">
              Las contraseñas no coinciden.
            </Form.Text>
          )}
        </Form.Group>
      </Col>
    </Row>
  );
};

export default PasswordInput;