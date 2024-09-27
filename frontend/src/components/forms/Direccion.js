// src/components/forms/Direccion.js

import React, { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const Direccion = ({ onDireccionCompleta }) => {
  const [tipoCalle, setTipoCalle] = useState('');
  const [numero1, setNumero1] = useState('');
  const [numero2, setNumero2] = useState('');
  const [numero3, setNumero3] = useState('');
  const [complemento, setComplemento] = useState('');

  const capitalizeEachWord = (str) => {
    return str.replace(/\w+/g, function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
  };

  const handleInputChange = (setter, format) => (e) => {
    let value = e.target.value;
    switch(format) {
      case 'uppercase':
        value = value.toUpperCase();
        break;
      case 'capitalizeWords':
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
    handleDireccionChange();
  };

  const handleDireccionChange = () => {
    const direccionCompleta = `${tipoCalle} ${numero1.trim()} # ${numero2.trim()}-${numero3.trim()} ${complemento.trim()}`.replace(/\s+/g, ' ').trim();
    if (typeof onDireccionCompleta === 'function') {
      onDireccionCompleta(direccionCompleta);
    } else {
      console.error('onDireccionCompleta no es una función');
    }
  };

  return (
    <div>
      <Form.Label className="mb-1">Dirección</Form.Label>
      <Row className="g-1 align-items-center">
        <Col xs={3} sm={3}>
          <Form.Select
            value={tipoCalle}
            onChange={handleInputChange(setTipoCalle, 'mixed')}
            required
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
            required
            maxLength="6"
            placeholder="25A"
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
            required
            maxLength="6"
            placeholder="2C"
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
            required
            maxLength="3"
            placeholder="32"
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
            placeholder="Cristóbal Colón"
          />
        </Col>
      </Row>
    </div>
  );
};

export default Direccion;