// src/components/forms/PasswordInput.js

import React, { useState } from 'react';
import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from "react-icons/bs";

const PasswordInput = ({ 
  value, 
  onChange, 
  confirmValue, 
  onConfirmChange, 
  name = "user_pass",
  label = "Contraseña"
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Regex para validación de contraseña
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  // Validar la contraseña
  const isPasswordValid = passwordRegex.test(value);
  const doPasswordsMatch = confirmValue !== undefined ? value === confirmValue : true;

  return (
    <Row>
      <Col md={confirmValue !== undefined ? 6 : 12}>
        <Form.Group controlId={name}>
          <Form.Label>{label}</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name={name}
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
        </Form.Group>
      </Col>

      {confirmValue !== undefined && (
        <Col md={6}>
          <Form.Group controlId={`${name}_confirm`}>
            <Form.Label>Confirmar Contraseña</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name={`${name}_confirm`}
                value={confirmValue}
                onChange={onConfirmChange}
                required
                isValid={confirmValue && doPasswordsMatch && isPasswordValid}
                isInvalid={confirmValue && (!doPasswordsMatch || !isPasswordValid)}
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
      )}
    </Row>
  );
};

export default PasswordInput;