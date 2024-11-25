import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from "react-icons/bs";

// Definimos los requisitos de contraseña con sus expresiones regulares
const PASSWORD_REQUIREMENTS = [
  {
    regex: /.{8,}/,
    text: 'Mínimo 8 caracteres'
  },
  {
    regex: /[A-Z]/,
    text: 'Al menos una letra mayúscula'
  },
  {
    regex: /[a-z]/,
    text: 'Al menos una letra minúscula'
  },
  {
    regex: /[0-9]/,
    text: 'Al menos un número'
  },
  {
    regex: /[!@#$%^&*]/,
    text: 'Al menos un carácter especial (!@#$%^&*)'
  }
];

const PasswordInput = ({ 
  value, 
  onChange, 
  confirmValue, 
  onConfirmChange, 
  name = "user_pass",
  label = "Contraseña",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState(
    PASSWORD_REQUIREMENTS.map(req => ({ ...req, fulfilled: false }))
  );
  const [showRequirements, setShowRequirements] = useState(false);

  // Actualizar el estado de los requisitos cuando cambia la contraseña
  useEffect(() => {
    const newRequirements = PASSWORD_REQUIREMENTS.map(req => ({
      ...req,
      fulfilled: req.regex.test(value)
    }));
    setPasswordRequirements(newRequirements);
  }, [value]);

  // Verificar si todos los requisitos se cumplen
  const isPasswordValid = passwordRequirements.every(req => req.fulfilled);
  const doPasswordsMatch = confirmValue !== undefined ? value === confirmValue : true;

  // Mostrar requisitos cuando el input recibe el foco
  const handleFocus = () => {
    setShowRequirements(true);
  };

  // Opcional: ocultar requisitos cuando se cumplan todos
  useEffect(() => {
    if (isPasswordValid && value) {
      setTimeout(() => setShowRequirements(false), 1000); // Dar tiempo para ver que todo está correcto
    }
  }, [isPasswordValid, value]);

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
              onFocus={handleFocus}
              required
              isValid={value && isPasswordValid}
              isInvalid={value && !isPasswordValid}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BsEyeSlash /> : <BsEye />}
            </Button>
          </InputGroup>
          
          {/* Requisitos de contraseña dinámicos */}
          {showRequirements && value && (
            <div className="password-requirements mt-2">
              {passwordRequirements.map((req, index) => (
                <div 
                  key={index} 
                  className="d-flex align-items-center"
                  style={{ 
                    fontSize: '0.8rem',
                    color: req.fulfilled ? '#28a745' : '#6c757d',
                    marginBottom: '0.2rem',
                    transition: 'color 0.3s ease'
                  }}
                >
                  <i 
                    className={`bi ${req.fulfilled ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}
                    style={{ fontSize: '0.7rem' }}
                  ></i>
                  {req.text}
                </div>
              ))}
            </div>
          )}
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