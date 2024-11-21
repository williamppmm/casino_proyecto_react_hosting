// src/components/forms/NacionalidadInput.js

import React from 'react';
import { Form } from 'react-bootstrap';

const paises = [
  { codigo: 'CO', nombre: 'Colombia', prefijo: '+57' },
  { codigo: 'US', nombre: 'Estados Unidos', prefijo: '+1' },
  { codigo: 'MX', nombre: 'México', prefijo: '+52' },
  { codigo: 'AR', nombre: 'Argentina', prefijo: '+54' },
  { codigo: 'BR', nombre: 'Brasil', prefijo: '+55' }
];

const NacionalidadInput = ({
  value,
  onChange,
  error,
  required = true,
  onPrefixChange
}) => {
  const handleChange = (e) => {
    const selectedCountry = paises.find(pais => pais.codigo === e.target.value);
    onChange(e);
    if (selectedCountry && onPrefixChange) {
      onPrefixChange(selectedCountry.prefijo);
    }
  };

  return (
    <Form.Group controlId="nacionalidad">
      <Form.Label>
        Nacionalidad {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Select
        name="nacionalidad"
        value={value}
        onChange={handleChange}
        required={required}
        isInvalid={!!error}
      >
        <option value="">Seleccionar</option>
        {paises.map(pais => (
          <option key={pais.codigo} value={pais.codigo}>
            {pais.nombre}
          </option>
        ))}
      </Form.Select>
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default NacionalidadInput;