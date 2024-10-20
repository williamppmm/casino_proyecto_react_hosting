// src/components/forms/CodigoAutorizacion.js

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const CodigoAutorizacion = ({ onCodigoValido }) => {
  const [codigo, setCodigo] = useState('');

  const handleCodigoChange = (e) => {
    const newCodigo = e.target.value;
    setCodigo(newCodigo);
    // Envía el código al componente padre sin verificar aquí
    onCodigoValido(newCodigo);
  };

  return (
    <Form.Group>
      <Form.Label>Código de Autorización</Form.Label>
      <Form.Control 
        type="text" 
        value={codigo} 
        onChange={handleCodigoChange} 
        placeholder="Ingresa el código de autorización" 
        required 
      />
    </Form.Group>
  );
};

export default CodigoAutorizacion;