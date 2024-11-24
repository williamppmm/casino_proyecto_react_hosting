import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const TelefonoInput = ({ value, onChange, error, required = true }) => {
  const [telefono, setTelefono] = useState(value ? value.slice(3) : '');

  const validarTelefono = (telefono) => {
    return /^3\d{9}$/.test(telefono);
  };

  const handleChange = (e) => {
    const nuevoTelefono = e.target.value.replace(/\D/g, '');
    if (nuevoTelefono.length <= 10) {
      setTelefono(nuevoTelefono);
      if (validarTelefono(nuevoTelefono)) {
        onChange(`+57${nuevoTelefono}`);
      } else {
        onChange('');
      }
    }
  };

  return (
    <Form.Group controlId="telefono_movil" className="mb-2">
      <Form.Label className="mb-2">
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
          style={{ borderTopRightRadius: '0.375rem', borderBottomRightRadius: '0.375rem' }}
        />
        <Form.Control.Feedback type="invalid">
          {error || 'Ingresa un número de teléfono válido de 10 dígitos. El formato es: +57 3001234567'}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
};

export default TelefonoInput;