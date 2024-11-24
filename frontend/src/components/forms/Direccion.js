// src/components/forms/Direccion.js

import React, { useState, useCallback } from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const Direccion = ({ onDireccionCompleta, required = true, error }) => {
  const [tipoCalle, setTipoCalle] = useState('');
  const [numero1, setNumero1] = useState('');
  const [numero2, setNumero2] = useState('');
  const [numero3, setNumero3] = useState('');
  const [complemento, setComplemento] = useState('');

  // Función para capitalizar cada palabra manteniendo ñ y acentos
  const capitalizeEachWord = (str) => {
    return str
      .split(' ')
      .map(word => {
        if (!word) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  const updateDireccionCompleta = useCallback(() => {
    const direccionCompleta = `${tipoCalle} ${numero1.trim()} # ${numero2.trim()}-${numero3.trim()} ${complemento}`
      .replace(/\s+/g, ' ')
      .trim();

    if (typeof onDireccionCompleta === 'function') {
      onDireccionCompleta(direccionCompleta);
    }
  }, [tipoCalle, numero1, numero2, numero3, complemento, onDireccionCompleta]);

  const handleInputChange = (setter, format) => (e) => {
    let value = e.target.value;
    switch (format) {
      case 'uppercase':
        value = value.replace(/[^0-9A-ZÑñ\s]/g, '').toUpperCase();
        break;
      case 'capitalizeWords':
        // Permitir letras, números, ñ, tildes, espacios y algunos caracteres especiales
        value = value.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s'-]/g, '');
        value = capitalizeEachWord(value);
        break;
      case 'number':
        value = value.replace(/\D/g, '');
        break;
      case 'mixed':
        break;
      default:
        break;
    }
    setter(value);
    setTimeout(updateDireccionCompleta, 0);
  };

  return (
    <div>
      <Form.Label className="mb-2">
        Dirección {required && <span className="text-danger">*</span>}{" "}
        <span style={{ color: '#a0a0a0', fontSize: '0.9em' }}>
          (Ej: Calle 33 # 24 - 16 San Fernando)
        </span>
      </Form.Label>
      <Row className="g-1 align-items-center">
        <Col xs={3} sm={3}>
          <Form.Select
            value={tipoCalle}
            onChange={handleInputChange(setTipoCalle, 'mixed')}
            required={required}
            isInvalid={!!error}
          >
            <option value="">Seleccionar</option>
            <option value="Calle">Calle</option>
            <option value="Carrera">Carrera</option>
            <option value="Avenida">Avenida</option>
            <option value="Diagonal">Diagonal</option>
            <option value="Transversal">Transversal</option>
          </Form.Select>
        </Col>

        <Col xs={2} sm={1}>
          <Form.Control
            type="text"
            value={numero1}
            onChange={handleInputChange(setNumero1, 'uppercase')}
            required={required}
            maxLength="5"
            placeholder=""
            isInvalid={!!error}
          />
        </Col>

        <Col xs="auto" className="px-0">
          <span className="mx-1">#</span>
        </Col>

        <Col xs={2} sm={1}>
          <Form.Control
            type="text"
            value={numero2}
            onChange={handleInputChange(setNumero2, 'uppercase')}
            required={required}
            maxLength="5"
            placeholder=""
            isInvalid={!!error}
          />
        </Col>

        <Col xs="auto" className="px-0">
          <span className="mx-1">-</span>
        </Col>

        <Col xs={2} sm={1}>
          <Form.Control
            type="text"
            value={numero3}
            onChange={handleInputChange(setNumero3, 'number')}
            required={required}
            maxLength="3"
            placeholder=""
            isInvalid={!!error}
          />
        </Col>

        <Col xs="auto">
          <span className="ms-2 me-1">Barrio</span>
        </Col>

        <Col xs={12} sm={4}>
          <Form.Control
            type="text"
            value={complemento}
            onChange={handleInputChange(setComplemento, 'capitalizeWords')}
            placeholder=""
          />
        </Col>
      </Row>
      {error && (
        <Form.Text className="text-danger">
          {error}
        </Form.Text>
      )}
    </div>
  );
};

export default Direccion;