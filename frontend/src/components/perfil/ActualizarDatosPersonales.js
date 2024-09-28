// src/components/perfil/ActualizarDatosPersonales.js

import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { actualizarDatosCliente } from '../../services/api';

const ActualizarDatosPersonales = ({ cliente, onActualizacion }) => {
  const [formData, setFormData] = useState({
    telefono_movil: cliente.telefono_movil || '',
    direccion: cliente.direccion || '',
    municipio: cliente.municipio || '',
    interdicto: cliente.interdicto || false,
    pep: cliente.pep || false
  });
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarDatosCliente(cliente.id_cliente, formData);
      setMessage({ type: 'success', text: 'Datos actualizados correctamente' });
      onActualizacion({ ...cliente, ...formData });
    } catch (error) {
      setMessage({ type: 'danger', text: error.message || 'Error al actualizar los datos' });
    }
  };

  return (
    <>
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Teléfono Móvil</Form.Label>
          <Form.Control
            type="text"
            name="telefono_movil"
            value={formData.telefono_movil}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Municipio</Form.Label>
          <Form.Control
            type="text"
            name="municipio"
            value={formData.municipio}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Interdicto"
            name="interdicto"
            checked={formData.interdicto}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="PEP"
            name="pep"
            checked={formData.pep}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Guardar Cambios</Button>
      </Form>
    </>
  );
};

export default ActualizarDatosPersonales;