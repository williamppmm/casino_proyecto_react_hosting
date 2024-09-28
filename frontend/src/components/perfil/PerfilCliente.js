import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form, Col, Alert, Card, Modal, Row } from 'react-bootstrap';
import axios from 'axios';
import Direccion from '../../components/forms/Direccion';

const PerfilCliente = () => {
  const [token, setToken] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [formData, setFormData] = useState({
    telefono_movil: '',
    direccion: '',
    municipio: '',
    interdicto: false,
    pep: false
  });
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    const clienteInfo = JSON.parse(localStorage.getItem('clienteInfo'));

    if (!tokenFromStorage || !clienteInfo) {
      navigate('/login-cliente');
    } else {
      setToken(tokenFromStorage);
      setCliente(clienteInfo);
      resetFormData(clienteInfo);
    }
  }, [navigate]);

  const resetFormData = (clienteInfo) => {
    setFormData({
      telefono_movil: clienteInfo.telefono_movil || '',
      direccion: clienteInfo.direccion || '',
      municipio: clienteInfo.municipio || '',
      interdicto: clienteInfo.interdicto || false,
      pep: clienteInfo.pep || false
    });
  };

  const validatePhoneNumber = (phone) => {
    return phone.length === 10;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (name === 'telefono_movil') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
      if (!validatePhoneNumber(newValue)) {
        setMessage({ type: 'danger', text: 'El teléfono debe contener 10 dígitos' });
      } else {
        setMessage(null);
      }
    } else if (['municipio'].includes(name)) {
      newValue = value
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : newValue
    }));
  };

  const handleDireccionChange = (direccionCompleta) => {
    setFormData(prevData => ({
      ...prevData,
      direccion: direccionCompleta
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cliente || !token) {
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/clientes/actualizar-datos/${cliente.id_cliente}`,
        { ...formData, password },
        {
          headers: { Authorization: `${token}` }
        }
      );

      const updatedCliente = { ...cliente, ...formData };
      localStorage.setItem('clienteInfo', JSON.stringify(updatedCliente));
      setCliente(updatedCliente);
      setPassword('');
      setShowModal(false);
      setMessage({ type: 'success', text: 'Datos actualizados correctamente' });
    } catch (error) {
      console.error('Error al actualizar los datos del cliente:', error);
      setMessage({ type: 'danger', text: 'Error al actualizar los datos del cliente' });
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setPassword('');
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Datos no sensibles</h2>

            {message && (
              <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                {message.text}
              </Alert>
            )}

            {cliente && (
              <>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Teléfono Móvil</Form.Label>
                        <Form.Control
                          type="text"
                          name="telefono_movil"
                          value={formData.telefono_movil}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Municipio</Form.Label>
                        <Form.Control
                          type="text"
                          name="municipio"
                          value={formData.municipio}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Direccion onDireccionCompleta={handleDireccionChange} direccionInicial={formData.direccion} />

                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Interdicto"
                          name="interdicto"
                          checked={formData.interdicto}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="PEP"
                          name="pep"
                          checked={formData.pep}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Col className="text-center mt-4">
                    <Button variant="primary" onClick={handleOpenModal}>
                      Actualizar información
                    </Button>
                  </Col>
                </Form>

                <Modal show={showModal} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Confirmar actualización</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group>
                        <Form.Label>Introduce tu contraseña para confirmar</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Contraseña actual"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Button variant="primary" type="submit" className="mt-3 w-100">
                        Confirmar
                      </Button>
                    </Form>
                  </Modal.Body>
                </Modal>
              </>
            )}

            <div className="mt-4 text-center">
              <Button variant="secondary" onClick={() => navigate('/dashboard-cliente')} className="w-100">
                Volver al Dashboard
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default PerfilCliente;