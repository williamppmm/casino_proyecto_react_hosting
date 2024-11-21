// src/components/forms/TelefonoInput.js

import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const TelefonoInput = ({ value, onChange, error, required = true }) => {
  const [telefono, setTelefono] = useState(value ? value.slice(3) : ''); // Excluye el "+57" al iniciar

  // Validar que el número empiece por 3 y tenga exactamente 10 dígitos
  const validarTelefono = (telefono) => {
    return /^3\d{9}$/.test(telefono); // Debe comenzar con 3 y tener 10 dígitos
  };

  const handleChange = (e) => {
    const nuevoTelefono = e.target.value.replace(/\D/g, ''); // Solo números
    if (nuevoTelefono.length <= 10) { // Limitar a 10 dígitos
      setTelefono(nuevoTelefono);
      if (validarTelefono(nuevoTelefono)) {
        onChange(`+57${nuevoTelefono}`); // Enviar el número completo con +57
      } else {
        onChange(''); // Enviar vacío si no es válido
      }
    }
  };

  return (
    <Form.Group controlId="telefono_movil">
      <Form.Label>
        Teléfono Móvil {required && <span className="text-danger">*</span>}
      </Form.Label>
      <InputGroup>
        <InputGroup.Text>+57</InputGroup.Text>
        <Form.Control
          type="text"
          value={telefono}
          onChange={handleChange}
          placeholder="3001234567"
          required={required}
          isInvalid={required && telefono && !validarTelefono(telefono)}
        />
        <Form.Control.Feedback type="invalid">
          {error || 'Ingresa un número de teléfono válido de 10 dígitos. El formato es: +57 3001234567'}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
};

export default TelefonoInput;