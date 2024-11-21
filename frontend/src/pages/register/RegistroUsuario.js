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
import NacionalidadInput from '../../components/forms/NacionalidadInput';
import TelefonoInput from '../../components/forms/TelefonoInput';

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
  const [emailValidation, setEmailValidation] = useState({ isValid: false, error: null });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const capitalizeWords = (str) => {
    return str.split(' ')
      .map(word => {
        if (word.length === 0) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  const handleTipoUsuarioChange = (e) => setTipoUsuario(e.target.value);

  const handleEmailValidation = (validation) => {
    setEmailValidation(validation);
  };

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
    let newValue = value || '';
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
      error = newValue.length === 10 ? '' : 'Ingresa un número de teléfono válido de 10 dígitos.';
    } else if (['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'lugar_expedicion', 'municipio', 'cargo'].includes(name)) {
      // Permitir ñ, Ñ, vocales con tilde, espacios y apóstrofes
      newValue = value.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ\s'-]/g, '');
      newValue = capitalizeWords(newValue);
    } else if (type === "checkbox") {
      newValue = checked;
    }
  
    let updatedFormValues = {
      ...formValues,
      [name]: newValue
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

    // Validación de campos requeridos
    const camposRequeridos = {
      tipo_documento: "Tipo de Documento",
      numero_documento: "Número de Documento",
      fecha_expedicion: "Fecha de Expedición",
      primer_nombre: "Primer Nombre",
      primer_apellido: "Primer Apellido",
      lugar_expedicion: "Lugar de Expedición",
      telefono_movil: "Teléfono Móvil",
      fecha_nacimiento: "Fecha de Nacimiento",
      genero: "Género",
      nacionalidad: "Nacionalidad",
      municipio: "Municipio"
    };

    Object.entries(camposRequeridos).forEach(([campo, nombre]) => {
      if (!formValues[campo]) {
        newErrors[campo] = `El campo ${nombre} es requerido`;
        isValid = false;
      }
    });

    // Validación de email
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || "El correo electrónico no es válido";
      isValid = false;
    }
  
    // Validación de contraseña
    if (!password) {
      newErrors.password = "La contraseña es requerida";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.password = "Las contraseñas no coinciden";
      isValid = false;
    }
  
    // Validaciones específicas por tipo de usuario
    if (tipoUsuario === 'Cliente') {
      if (!formValues.consentimiento_datos || !formValues.terminos_condiciones) {
        newErrors.terminos = "Debes aceptar el uso de datos y los términos y condiciones";
        isValid = false;
      }
    } else if (tipoUsuario === 'Operador') {
      if (!formValues.codigo_autorizacion) {
        newErrors.codigo_autorizacion = "El código de autorización es requerido para operadores";
        isValid = false;
      }
      if (!formValues.cargo) {
        newErrors.cargo = "El cargo es requerido para operadores";
        isValid = false;
      }
    }
  
    // Validación de ReCaptcha
    if (!captchaValue) {
      newErrors.captcha = "Por favor, completa el captcha";
      isValid = false;
    }
  
    // Validaciones específicas de formato
    const { tipo_documento, numero_documento } = formValues;
    if (numero_documento) {
      switch (tipo_documento) {
        case 'CC':
        case 'CE':
          if (!/^\d{5,10}$/.test(numero_documento)) {
            newErrors.numero_documento = "El número de documento debe contener entre 5 y 10 dígitos numéricos";
            isValid = false;
          }
          break;
        case 'PA':
          if (!/^[A-Z0-9]{9,15}$/.test(numero_documento)) {
            newErrors.numero_documento = "El pasaporte debe contener entre 9 y 15 caracteres alfanuméricos";
            isValid = false;
          }
          break;
        default:
          newErrors.tipo_documento = "Selecciona un tipo de documento válido";
          isValid = false;
      }
    }
  
    if (formValues.telefono_movil && !/^\d{10}$/.test(formValues.telefono_movil)) {
      newErrors.telefono_movil = "El número de teléfono debe contener exactamente 10 dígitos";
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

    try {
      const response = await registrarUsuario(datosParaEnviar);
      if (response.message === "Usuario registrado exitosamente") {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/login-usuario');
        }, 3000);
      }
    } catch (error) {
      console.error("Error en el proceso de registro:", error);
      setErrorMessage(error?.message || "Ocurrió un error durante el registro. Por favor, inténtalo de nuevo más tarde.");
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
                  Tipo de Usuario <span className="text-danger">*</span>
                </Form.Label>
                <Col sm={10}>
                  <Form.Check
                    type="radio"
                    label="Cliente"
                    name="tipoUsuario"
                    value="Cliente"
                    checked={tipoUsuario === 'Cliente'}
                    onChange={handleTipoUsuarioChange}
                    required
                  />
                  <Form.Check
                    type="radio"
                    label="Operador"
                    name="tipoUsuario"
                    value="Operador"
                    checked={tipoUsuario === 'Operador'}
                    onChange={handleTipoUsuarioChange}
                    required
                  />
                </Col>
              </Form.Group>

              {/* Campos comunes */}
              <Row className="mb-4">
                <Col md={4}>
                  <Form.Group controlId="tipo_documento">
                    <Form.Label>
                      Tipo de Documento <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="tipo_documento"
                      value={formValues.tipo_documento}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.tipo_documento}
                    >
                      <option value="">Seleccionar</option>
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="PA">Pasaporte</option>
                    </Form.Select>
                    {errors.tipo_documento && (
                      <Form.Control.Feedback type="invalid">
                        {errors.tipo_documento}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="numero_documento">
                    <Form.Label>
                      Número de Documento <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="numero_documento"
                      value={formValues.numero_documento}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.numero_documento}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.numero_documento}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="fecha_expedicion">
                    <Form.Label>
                      Fecha de Expedición <span className="text-danger">*</span>
                    </Form.Label>
                    <DatePicker
                      id="fecha_expedicion"
                      value={formValues.fecha_expedicion}
                      onDateChange={(date) => handleInputChange({
                        target: { name: 'fecha_expedicion', value: date }
                      })}
                      required
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
                    <Form.Label>
                      Género <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      name="genero"
                      value={formValues.genero}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.genero}
                    >
                      <option value="">Seleccionar</option>
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                      <option value="O">Otro</option>
                    </Form.Select>
                    {errors.genero && (
                      <Form.Control.Feedback type="invalid">
                        {errors.genero}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <NacionalidadInput
                    value={formValues.nacionalidad}
                    onChange={(e) => handleInputChange(e)}
                    error={errors.nacionalidad}
                    required={true}
                    onPrefixChange={(prefix) => {
                      // Actualiza el prefijo en caso de necesitarlo para algún campo adicional
                      console.log(`Prefijo seleccionado: ${prefix}`);
                    }}
                  />
                </Col>

                <Col md={4}>
                  <Form.Group controlId="fecha_nacimiento">
                    <Form.Label>
                      Fecha de Nacimiento <span className="text-danger">*</span>
                    </Form.Label>
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
                    <Form.Label>
                      Primer Nombre <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="primer_nombre"
                      value={formValues.primer_nombre}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.primer_nombre}
                    />
                    {errors.primer_nombre && (
                      <Form.Control.Feedback type="invalid">
                        {errors.primer_nombre}
                      </Form.Control.Feedback>
                    )}
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
                    <Form.Label>
                      Primer Apellido <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="primer_apellido"
                      value={formValues.primer_apellido}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.primer_apellido}
                    />
                    {errors.primer_apellido && (
                      <Form.Control.Feedback type="invalid">
                        {errors.primer_apellido}
                      </Form.Control.Feedback>
                    )}
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
                    <Form.Label>
                      Lugar de Expedición <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="lugar_expedicion"
                      value={formValues.lugar_expedicion}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.lugar_expedicion}
                    />
                    {errors.lugar_expedicion && (
                      <Form.Control.Feedback type="invalid">
                        {errors.lugar_expedicion}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <TelefonoInput
                    value={formValues.telefono_movil}
                    onChange={(telefono) =>
                      handleInputChange({
                        target: { name: 'telefono_movil', value: telefono }
                      })
                    }
                    error={errors.telefono_movil}
                    required={true}
                  />
                </Col>
              </Row>
              <Row className="mb-4">
                <EmailInput 
                  email={email}
                  confirmEmail={confirmEmail}
                  onEmailChange={setEmail}
                  onConfirmEmailChange={setConfirmEmail}
                  onValidationChange={handleEmailValidation}
                  autoComplete="email"
                  required={true}
                />
                {errors.email && (
                  <Form.Text className="text-danger">
                    {errors.email}
                  </Form.Text>
                )}
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="user_pass"
                    label={<>Contraseña <span className="text-danger">*</span></>}
                    autoComplete="new-password"
                    required={true}
                  />
                  {errors.password && (
                    <Form.Text className="text-danger">
                      {errors.password}
                    </Form.Text>
                  )}
                </Col>

                <Col md={6}>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    name="confirm_user_pass"
                    label={<>Confirmar Contraseña <span className="text-danger">*</span></>}
                    autoComplete="new-password"
                    required={true}
                  />
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Direccion 
                  onDireccionCompleta={handleDireccionChange} 
                  required={true}
                  error={errors.direccion}
                />
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group controlId="municipio">
                    <Form.Label>
                      Municipio <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="municipio"
                      value={formValues.municipio}
                      onChange={handleInputChange}
                      required
                      isInvalid={!!errors.municipio}
                    />
                    {errors.municipio && (
                      <Form.Control.Feedback type="invalid">
                        {errors.municipio}
                      </Form.Control.Feedback>
                    )}
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
                        label={<>Acepto el tratamiento de mis datos personales <span className="text-danger">*</span></>}
                        checked={formValues.consentimiento_datos}
                        onChange={handleInputChange}
                        required
                        isInvalid={!!errors.terminos}
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
                        label={<>Acepto los términos y condiciones <span className="text-danger">*</span></>}
                        checked={formValues.terminos_condiciones}
                        onChange={handleInputChange}
                        required
                        isInvalid={!!errors.terminos}
                      />
                      {errors.terminos && (
                        <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                          {errors.terminos}
                        </Form.Control.Feedback>
                      )}
                    </Col>
                  </Row>
                </>
              )}

              {tipoUsuario === 'Operador' && (
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group controlId="cargo">
                      <Form.Label>
                        Cargo <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="cargo"
                        value={formValues.cargo}
                        onChange={handleInputChange}
                        required
                        isInvalid={!!errors.cargo}
                      />
                      {errors.cargo && (
                        <Form.Control.Feedback type="invalid">
                          {errors.cargo}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <CodigoAutorizacion 
                      onCodigoValido={handleCodigoValido} 
                      required={true}
                      error={errors.codigo_autorizacion}
                    />
                  </Col>
                </Row>
              )}
              <Row className="mb-4">
                <Col>
                  <Form.Label>
                    Verificación <span className="text-danger">*</span>
                  </Form.Label>
                  <ReCaptcha onChange={setCaptchaValue} />
                  {errors.captcha && (
                    <Form.Text className="text-danger d-block mt-2">
                      {errors.captcha}
                    </Form.Text>
                  )}
                </Col>
              </Row>

              <Row>
                <Col className="text-center">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="px-5 py-2 btn-lg"
                  >
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

      {/* Modal de Error */}
      <Modal 
        show={showErrorModal} 
        onHide={() => setShowErrorModal(false)} 
        centered
        aria-labelledby="error-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="error-modal">Error en el registro</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowErrorModal(false)}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Éxito */}
      <Modal 
        show={showSuccessModal} 
        onHide={() => setShowSuccessModal(false)}
        centered
        backdrop="static"
        keyboard={false}
        aria-labelledby="success-modal"
      >
        <Modal.Header style={{ backgroundColor: '#d4edda', borderBottom: '1px solid #c3e6cb' }}>
          <Modal.Title id="success-modal" style={{ color: '#155724' }}>
            ¡Registro Exitoso!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#d4edda', color: '#155724' }}>
          <div className="text-center">
            <i className="bi bi-check-circle-fill h1"></i>
            <p className="mt-3">Tu cuenta ha sido creada exitosamente.</p>
            <p className="mb-0">Serás redirigido a la página de inicio de sesión en unos momentos...</p>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}