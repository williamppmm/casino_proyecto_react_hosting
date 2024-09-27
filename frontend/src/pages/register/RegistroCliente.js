// src/pages/register/RegistroCliente.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { registerCliente } from '../../services/api'; // Importa la función de registro
import Direccion from '../../components/forms/Direccion';
import DatePicker from '../../components/forms/DatePicker';
import PasswordInput from '../../components/forms/PasswordInput';
import EmailInput from '../../components/forms/EmailInput';

export default function RegistroClientes() {
  const navigate = useNavigate();
  
  const [formValues, setFormValues] = useState({
    tipo_documento: "",
    numero_documento: "",
    fecha_expedicion: null,
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    lugar_expedicion: "",
    telefono_movil: "",
    fecha_nacimiento: null,
    genero: "",
    nacionalidad: "",
    direccion: "",
    municipio: "",
    interdicto: false,
    pep: false,
    consentimiento_datos: false,
    comunicaciones_comerciales: false,
    terminos_condiciones: false
    // captcha: false // problemas de implementación lo eliminé
  });

  const [phoneError, setPhoneError] = useState(""); // Añadimos validación para teléfono
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState("");

  // Manejar cambios de entrada
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (name === 'telefono_movil') {
      newValue = value.replace(/\D/g, '').slice(0, 10); // Limitar a 10 dígitos
      validatePhoneNumber(newValue);
    } else if (['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'lugar_expedicion', 'municipio'].includes(name)) {
      newValue = value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    } else if (type !== "checkbox") {
      newValue = value.toUpperCase();
    }

    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : newValue
    });
  };

  // Validar el número de teléfono
  const validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber.length !== 10) {
      setPhoneError("El número de teléfono debe contener exactamente 10 dígitos.");
    } else {
      setPhoneError("");
    }
  };

  // Manejar la dirección ingresada
  const handleDireccionChange = (direccionCompleta) => {
    setFormValues({
      ...formValues,
      direccion: direccionCompleta
    });
  };

  const validateForm = () => {
    if (email !== confirmEmail) {
      setError("Los correos electrónicos no coinciden");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    if (!formValues.consentimiento_datos || !formValues.terminos_condiciones) {
      setError("Debes aceptar el uso de datos y los términos y condiciones");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const datosParaEnviar = {
      ...formValues,
      correo_electronico: email,
      user_pass: password
    };

    try {
      const response = await registerCliente(datosParaEnviar);

      if (response.message === "Cliente registrado exitosamente") {
        alert("Registro exitoso");
        navigate('/login-cliente');
      }
    } catch (error) {
      setError(error || "Error en el registro");
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Registro de Clientes</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row className="mb-4">
                <Col md={4}>
                  <Form.Group controlId="tipo_documento">
                    <Form.Label>Tipo de Documento</Form.Label>
                    <Form.Select
                      name="tipo_documento"
                      value={formValues.tipo_documento}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="PA">Pasaporte</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="numero_documento">
                    <Form.Label>Número de Documento</Form.Label>
                    <Form.Control
                      type="text"
                      name="numero_documento"
                      value={formValues.numero_documento}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="fecha_expedicion">
                    <Form.Label>Fecha de Expedición</Form.Label>
                    <DatePicker
                      value={formValues.fecha_expedicion}
                      onDateChange={(date) => setFormValues({ ...formValues, fecha_expedicion: date })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={3}>
                  <Form.Group controlId="primer_nombre">
                    <Form.Label>Primer Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="primer_nombre"
                      value={formValues.primer_nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="segundo_nombre">
                    <Form.Label>Segundo Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="segundo_nombre"
                      value={formValues.segundo_nombre}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="primer_apellido">
                    <Form.Label>Primer Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="primer_apellido"
                      value={formValues.primer_apellido}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="segundo_apellido">
                    <Form.Label>Segundo Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="segundo_apellido"
                      value={formValues.segundo_apellido}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group controlId="lugar_expedicion">
                    <Form.Label>Lugar de Expedición</Form.Label>
                    <Form.Control
                      type="text"
                      name="lugar_expedicion"
                      value={formValues.lugar_expedicion}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="telefono_movil">
                    <Form.Label>Teléfono Móvil</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefono_movil"
                      value={formValues.telefono_movil}
                      onChange={handleInputChange}
                      isInvalid={!!phoneError}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {phoneError}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <EmailInput
                email={email}
                confirmEmail={confirmEmail}
                onEmailChange={setEmail}
                onConfirmEmailChange={setConfirmEmail}
                autoComplete="email"
              />

              <Row className="mb-2">
                <Col md={6}>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="user_pass"
                    label="Contraseña"
                    autoComplete="new-password"
                  />
                </Col>
                <Col md={6}>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    name="confirm_user_pass"
                    label="Confirmar Contraseña"
                    autoComplete="new-password"
                  />
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col>
                  <p className="text-white small">
                    La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y un carácter especial.
                  </p>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={4}>
                  <Form.Group controlId="fecha_nacimiento">
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <DatePicker
                      value={formValues.fecha_nacimiento}
                      onDateChange={(date) => setFormValues({ ...formValues, fecha_nacimiento: date })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="genero">
                    <Form.Label>Género</Form.Label>
                    <Form.Select
                      name="genero"
                      value={formValues.genero}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">Otro</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="nacionalidad">
                    <Form.Label>Nacionalidad</Form.Label>
                    <Form.Select
                      name="nacionalidad"
                      value={formValues.nacionalidad}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      <option value="CO">Colombia</option>
                      <option value="US">Estados Unidos</option>
                      <option value="MX">México</option>
                      <option value="AR">Argentina</option>
                      <option value="BR">Brasil</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Direccion onDireccionCompleta={handleDireccionChange} /> {/* Este componente ya está siendo usado */}

              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group controlId="municipio">
                    <Form.Label>Municipio</Form.Label>
                    <Form.Control
                      type="text"
                      name="municipio"
                      value={formValues.municipio}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Check
                    type="checkbox"
                    id="interdicto"
                    name="interdicto"
                    label="Interdicto"
                    checked={formValues.interdicto}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Check
                    type="checkbox"
                    id="pep"
                    name="pep"
                    label="PEP (Persona Expuesta Políticamente)"
                    checked={formValues.pep}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Check
                    type="checkbox"
                    id="consentimiento_datos"
                    name="consentimiento_datos"
                    label="Acepto el tratamiento de mis datos personales"
                    checked={formValues.consentimiento_datos}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Check
                    type="checkbox"
                    id="comunicaciones_comerciales"
                    name="comunicaciones_comerciales"
                    label="Deseo recibir comunicaciones comerciales"
                    checked={formValues.comunicaciones_comerciales}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <Form.Check
                    type="checkbox"
                    id="terminos_condiciones"
                    name="terminos_condiciones"
                    label="Acepto los términos y condiciones"
                    checked={formValues.terminos_condiciones}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
              </Row>

              <Row>
                <Col className="text-center">
                  <Button type="submit" variant="primary" className="px-5 py-2 btn-lg">
                    Registrarse
                  </Button>
                </Col>
              </Row>

              {/* Opciones de navegación actualizadas */}
              <Row className="mt-4">
                <Col className="text-center">
                  <p className="text-light">
                    ¿Ya tienes una cuenta? <Link to="/login-cliente" className="text-primary">Iniciar sesión</Link>
                  </p>
                  <p className="text-light">
                    <Link to="/" className="text-secondary">Volver al inicio</Link>
                  </p>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}