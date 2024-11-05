// src/pages/register/RegistroUsuario.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap';
import Direccion from '../../components/forms/Direccion';
import DatePicker from '../../components/forms/DatePicker';
import PasswordInput from '../../components/forms/PasswordInput';
import EmailInput from '../../components/forms/EmailInput';
import CodigoAutorizacion from '../../components/forms/CodigoAutorizacion';
import ReCaptcha from '../../components/common/ReCaptcha';
import { registrarUsuario } from '../../services/api';

export default function RegistroUsuario() {
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
    terminos_condiciones: false,
    cargo: "",
    fecha_ingreso: null,
    codigo_autorizacion: ""
  });

  const [errors, setErrors] = useState({});
  const [tipoUsuario, setTipoUsuario] = useState('Cliente');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTipoUsuarioChange = (e) => setTipoUsuario(e.target.value);

  const validateDates = (fechaNacimiento, fechaExpedicion) => {
    if (!fechaNacimiento || !fechaExpedicion) return '';
    
    const nacimiento = new Date(fechaNacimiento);
    const expedicion = new Date(fechaExpedicion);
    const hoy = new Date();
    
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesesDiferencia = hoy.getMonth() - nacimiento.getMonth();
    
    if (mesesDiferencia < 0 || (mesesDiferencia === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    if (edad < 18) {
      return 'Debes ser mayor de edad para registrarte.';
    }
    
    const añosDesdeNacimiento = expedicion.getFullYear() - nacimiento.getFullYear();
    const mesesDesdeNacimiento = expedicion.getMonth() - nacimiento.getMonth();
    
    if (añosDesdeNacimiento < 18 || (añosDesdeNacimiento === 18 && mesesDesdeNacimiento < 0)) {
      return 'La fecha de expedición debe ser al menos 18 años después de la fecha de nacimiento.';
    }
    
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value ? value : '';  // Asegúrate de que value no sea null o undefined
    let error = '';
  
    if (name === 'numero_documento') {
      const { tipo_documento } = formValues;
      if (tipo_documento === 'CC' || tipo_documento === 'CE') {
        newValue = newValue.replace(/\D/g, '').slice(0, 10);
        error = /^\d{5,10}$/.test(newValue) ? '' : 'El número de cédula o de extranjería debe contener entre 5 y 10 dígitos numéricos.';
      } else if (tipo_documento === 'PA') {
        newValue = newValue.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
        error = /^[A-Z0-9]{9,15}$/.test(newValue) ? '' : 'El pasaporte debe contener entre 9 y 15 caracteres alfanuméricos.';
      }
    } else if (name === 'telefono_movil') {
      newValue = newValue.replace(/\D/g, '').slice(0, 10);
      error = newValue.length === 10 ? '' : 'Ingresa un número de teléfono válido de 10 dígitos. ';
    } else if (['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'lugar_expedicion', 'municipio', 'cargo'].includes(name)) {
      newValue = newValue
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    } else if (type !== "checkbox") {
      newValue = newValue.toUpperCase();
    }
  
    let updatedFormValues = {
      ...formValues,
      [name]: type === "checkbox" ? checked : newValue
    };
  
    if (name === 'fecha_nacimiento' || name === 'fecha_expedicion') {
      const dateError = validateDates(
        name === 'fecha_nacimiento' ? newValue : formValues.fecha_nacimiento,
        name === 'fecha_expedicion' ? newValue : formValues.fecha_expedicion
      );
      if (dateError) {
        error = dateError;
      }
    }
  
    setFormValues(updatedFormValues);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleDireccionChange = (direccionCompleta) => {
    setFormValues({
      ...formValues,
      direccion: direccionCompleta
    });
  };

  const handleCodigoValido = (codigo) => {
    setFormValues({ ...formValues, codigo_autorizacion: codigo });
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (email !== confirmEmail) {
      newErrors.email = "Los correos electrónicos no coinciden";
      isValid = false;
    }
  
    if (password !== confirmPassword) {
      newErrors.password = "Las contraseñas no coinciden";
      isValid = false;
    }
  
    if (tipoUsuario === 'Cliente' && (!formValues.consentimiento_datos || !formValues.terminos_condiciones)) {
      newErrors.terminos = "Debes aceptar el uso de datos y los términos y condiciones";
      isValid = false;
    }
  
    if (!captchaValue) {
      newErrors.captcha = "Por favor, completa el captcha.";
      isValid = false;
    }
  
    if (tipoUsuario === 'Operador' && !formValues.codigo_autorizacion) {
      newErrors.codigo_autorizacion = "El código de autorización es requerido para operadores.";
      isValid = false;
    }
  
    const { tipo_documento, numero_documento } = formValues;
    if (!numero_documento) {
      newErrors.numero_documento = "El número de documento es requerido.";
      isValid = false;
    } else {
      switch (tipo_documento) {
        case 'CC':
        case 'CE':
          if (!/^\d{5,10}$/.test(numero_documento)) {
            newErrors.numero_documento = "El número de cédula debe contener entre 5 y 10 dígitos numéricos.";
            isValid = false;
          }
          break;
        case 'PA':
          if (!/^[A-Z0-9]{9,15}$/.test(numero_documento)) {
            newErrors.numero_documento = "El pasaporte debe contener entre 9 y 15 caracteres alfanuméricos.";
            isValid = false;
          }
          break;
        default:
          newErrors.numero_documento = "Selecciona un tipo de documento válido.";
          isValid = false;
      }
    }
  
    if (!formValues.telefono_movil) {
      newErrors.telefono_movil = "El número de teléfono es requerido.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formValues.telefono_movil)) {
      newErrors.telefono_movil = "El número de teléfono debe contener exactamente 10 dígitos.";
      isValid = false;
    }
  
    setErrors(newErrors);
  
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const datosParaEnviar = {
        ...formValues,
        correo_electronico: email,
        user_pass: password,
        tipo_usuario: tipoUsuario,
        recaptcha: captchaValue,
        fecha_ingreso: new Date()
    };

    console.log('Datos enviados al backend:', datosParaEnviar);
    
    try {
      const response = await registrarUsuario(datosParaEnviar);
      if (response.message === "Usuario registrado exitosamente") {
        navigate('/login-usuario');
      }
    } catch (error) {
      console.error("Error en el proceso de registro:", error);
      setErrorMessage(error || "Ocurrió un error durante el registro. Por favor, inténtalo de nuevo más tarde.");
      setShowErrorModal(true);
    }
  };


  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <Container style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card className="shadow-lg text-light" style={{ backgroundColor: '#141414', borderRadius: '10px' }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Registro de Usuario</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-4">
                <Form.Label as="legend" column sm={2}>
                  Tipo de Usuario
                </Form.Label>
                <Col sm={10}>
                  <Form.Check
                    type="radio"
                    label="Cliente"
                    name="tipoUsuario"
                    value="Cliente"
                    checked={tipoUsuario === 'Cliente'}
                    onChange={handleTipoUsuarioChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Operador"
                    name="tipoUsuario"
                    value="Operador"
                    checked={tipoUsuario === 'Operador'}
                    onChange={handleTipoUsuarioChange}
                  />
                </Col>
              </Form.Group>

              {/* Campos comunes */}
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
                    {errors.numero_documento && (
                      <Form.Text className="text-danger">
                        {errors.numero_documento}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="fecha_expedicion">
                    <Form.Label>Fecha de Expedición</Form.Label>
                    <DatePicker
                      id="fecha_expedicion"
                      value={formValues.fecha_expedicion}
                      onDateChange={(date) => handleInputChange({
                        target: { name: 'fecha_expedicion', value: date }
                      })}
                    />
                    {errors.fecha_expedicion && (
                      <Form.Text className="text-danger">
                        {errors.fecha_expedicion}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
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

                <Col md={4}>
                  <Form.Group controlId="fecha_nacimiento">
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <DatePicker
                      id="fecha_nacimiento"
                      value={formValues.fecha_nacimiento}
                      onDateChange={(date) => handleInputChange({
                        target: { name: 'fecha_nacimiento', value: date }
                      })}
                      required
                    />
                    {errors.fecha_nacimiento && (
                      <Form.Text className="text-danger">
                        {errors.fecha_nacimiento}
                      </Form.Text>
                    )}
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
                      isInvalid={!!errors.telefono_movil}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.telefono_movil}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <EmailInput 
                  email={email}
                  confirmEmail={confirmEmail}
                  onEmailChange={setEmail}
                  onConfirmEmailChange={setConfirmEmail}
                  autoComplete="email"
                />
              </Row>

              <Row className="mb-4">
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
                <Direccion onDireccionCompleta={handleDireccionChange} />
              </Row>

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

              {/* Campos dinámicos basados en el tipo de usuario */}
              {tipoUsuario === 'Cliente' && (
                <>
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
                </>
              )}

              {tipoUsuario === 'Operador' && (
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group controlId="cargo">
                      <Form.Label>Cargo</Form.Label>
                      <Form.Control
                        type="text"
                        name="cargo"
                        value={formValues.cargo}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <CodigoAutorizacion onCodigoValido={handleCodigoValido} />
                  </Col>
                </Row>
              )}

              <Row className="mb-4">
                <Col>
                  <ReCaptcha onChange={setCaptchaValue} />
                </Col>
              </Row>

              <Row>
                <Col className="text-center">
                  <Button type="submit" variant="primary" className="px-5 py-2 btn-lg">
                    Registrarse
                  </Button>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col className="text-center">
                  <p className="text-light">
                    ¿Ya tienes una cuenta? <Link to="/login-usuario" className="text-primary">Iniciar sesión</Link>
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
      {/* Modal para mostrar errores */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error en el registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}