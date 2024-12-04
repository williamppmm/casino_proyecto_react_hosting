// src/components/profile/ActualizarDatos.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Modal } from 'react-bootstrap';
import { obtenerDatosCliente, actualizarDatosCliente } from '../../services/api';
import TelefonoInput from '../forms/TelefonoInput';
import Direccion from '../forms/Direccion';
import { Home, LogOut } from 'lucide-react';

const ActualizarDatos = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    telefono_movil: '',
    direccion: '',
    municipio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para el modal
  const [password, setPassword] = useState(''); // Contraseña para confirmar cambios

  useEffect(() => {
    const fetchDatosActuales = async () => {
      try {
        const datos = await obtenerDatosCliente();
        setFormData({
          telefono_movil: datos.telefono_movil || '',
          direccion: datos.direccion || '',
          municipio: datos.municipio || ''
        });
      } catch (err) {
        setError('Error al cargar los datos actuales');
        console.error('Error:', err);
      }
    };

    fetchDatosActuales();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'municipio') {
      setFormData((prev) => ({
        ...prev,
        [name]: value
          .toLowerCase()
          .split(' ')
          .map((word, index, array) => {
            // Si la palabra es "de" o "del" y no es el inicio de un nombre propio
            // (verificamos si hay palabra antes y después)
            if ((word === 'de' || word === 'del') && index > 0 && index < array.length - 1) {
              return word;
            }
            // Para cualquier otra palabra, incluidos nombres que empiezan con "De"
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(' ')
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTelefonoChange = (telefono) => {
    setFormData((prev) => ({
      ...prev,
      telefono_movil: telefono
    }));
  };

  const handleDireccionChange = (direccionCompleta) => {
    setFormData((prev) => ({
      ...prev,
      direccion: direccionCompleta
    }));
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setPassword('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/login-usuario');
  };

  const handleConfirm = async () => {
    if (!password) {
      setError('Debe ingresar su contraseña para confirmar.');
      return;
    }

    const dataToSend = { ...formData, contrasena: password };

    try {
      setLoading(true);
      setError(null);
      await actualizarDatosCliente(dataToSend);
      setSuccess(true);
      setTimeout(() => {
        navigate('/perfil-cliente');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al actualizar los datos');
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container style={{ maxWidth: '700px' }}>
        <Card className="shadow-lg text-light mb-4" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4" style={{ fontSize: '1.8rem' }}>Actualizar Información</h2>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mb-4">
                Datos actualizados correctamente. Redirigiendo...
              </Alert>
            )}

            <Form>
              <TelefonoInput
                value={formData.telefono_movil}
                onChange={handleTelefonoChange}
                required={true}
              />

              <div className="mb-3">
                <Direccion
                  onDireccionCompleta={handleDireccionChange}
                  required={true}
                />
              </div>

              <Form.Group className="mb-4">
                <Form.Label style={{ fontSize: '1rem' }}>
                  Municipio <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="municipio"
                  value={formData.municipio}
                  onChange={handleChange}
                  placeholder="Ingrese su municipio"
                  required
                  style={{ backgroundColor: '#fff', color: 'black', fontSize: '1rem' }}
                />
              </Form.Group>

              <div className="d-flex justify-content-center gap-3">
                <Button
                  className="btn btn-primary px-4 py-2"
                  type="button"
                  onClick={handleOpenModal}
                  disabled={loading}
                  style={{ fontSize: '1rem' }}
                >
                  {loading ? 'Actualizando...' : 'Guardar Cambios'}
                </Button>
                <Link
                  to="/perfil-cliente"
                  className="btn btn-outline-secondary px-4 py-2"
                  style={{ fontSize: '1rem' }}
                >
                  Cancelar
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Botones adicionales */}
        <div className="mt-4 text-center">
          <Button
            variant="outline-primary"
            className="btn btn-outline-primary px-4 py-2 me-2"
            onClick={() => navigate('/dashboard-cliente')}
            style={{ fontSize: '1rem' }}
          >
            <Home size={18} className="me-2" /> Dashboard
          </Button>
          <Button
            variant="outline-danger"
            className="btn btn-outline-danger px-4 py-2"
            onClick={handleLogout}
            style={{ fontSize: '1rem' }}
          >
            <LogOut size={18} className="me-2" /> Cerrar Sesión
          </Button>
        </div>
      </Container>

      {/* Modal de Confirmación */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        style={{ color: 'black' }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.5rem' }}>Confirmar Cambios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontSize: '1rem' }}>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña para confirmar"
              required
              style={{ fontSize: '1rem' }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-light px-4 py-2" onClick={handleCloseModal} style={{ fontSize: '1rem' }}>
            Cancelar
          </Button>
          <Button className="btn btn-primary px-4 py-2" onClick={handleConfirm} style={{ fontSize: '1rem' }}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ActualizarDatos;