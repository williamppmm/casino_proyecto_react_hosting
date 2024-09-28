import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { actualizarDatosCliente } from '../../services/api';

const PerfilCliente = () => {
  const [cliente, setCliente] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const clienteInfo = JSON.parse(localStorage.getItem('clienteInfo'));
    setCliente(clienteInfo);
    setFormData({
      telefono_movil: clienteInfo.telefono_movil || '',
      direccion: clienteInfo.direccion || '',
      municipio: clienteInfo.municipio || '',
      interdicto: clienteInfo.interdicto || false,
      pep: clienteInfo.pep || false
    });
  }, []);

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
      setEditMode(false);
      // Actualizar el cliente en el estado y en localStorage
      const updatedCliente = { ...cliente, ...formData };
      setCliente(updatedCliente);
      localStorage.setItem('clienteInfo', JSON.stringify(updatedCliente));
    } catch (error) {
      setMessage({ type: 'danger', text: error.message || 'Error al actualizar los datos' });
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: '100vh', color: '#fff', backgroundColor: '#000' }}>
      <h2 className="text-center mb-5">Mi Perfil</h2>
      {message && (
        <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
          {message.text}
        </Alert>
      )}
      {cliente && (
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="bg-dark text-white">
              <Card.Body>
                {!editMode ? (
                  <>
                    <h4>Nombre: {cliente.primer_nombre} {cliente.primer_apellido}</h4>
                    <p>Correo Electrónico: {cliente.correo_electronico}</p>
                    <p>Teléfono Móvil: {cliente.telefono_movil}</p>
                    <p>Dirección: {cliente.direccion}</p>
                    <p>Municipio: {cliente.municipio}</p>
                    <p>Interdicto: {cliente.interdicto ? 'Sí' : 'No'}</p>
                    <p>PEP: {cliente.pep ? 'Sí' : 'No'}</p>
                    <Button variant="primary" onClick={() => setEditMode(true)}>Editar Datos</Button>
                  </>
                ) : (
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
                    <Button variant="secondary" onClick={() => setEditMode(false)} className="ms-2">Cancelar</Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <div className="mt-4 text-center">
        <Button variant="secondary" onClick={() => navigate('/dashboard-cliente')}>
          Volver al Dashboard
        </Button>
      </div>
    </Container>
  );
};

export default PerfilCliente;