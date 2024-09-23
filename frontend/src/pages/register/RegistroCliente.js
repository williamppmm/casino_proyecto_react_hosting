import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { BsEye, BsEyeSlash } from "react-icons/bs";
import axios from 'axios';
import Direccion from '../../components/forms/Direccion';
import ReCaptcha from '../../components/forms/ReCaptcha';
import DatePicker from '../../components/forms/DatePicker'; // Importar el componente de selección de fecha

export default function RegistroClientes() {
  const navigate = useNavigate();
  
  // Estado inicial del formulario
  const [formValues, setFormValues] = useState({
    tipo_documento: "",
    numero_documento: "",
    fecha_expedicion: null,
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    lugar_expedicion: "",
    correo_electronico: "",
    confirmar_correo: "",
    telefono_movil: "",
    user_pass: "",
    confirm_user_pass: "",
    fecha_nacimiento: null,
    genero: "",
    nacionalidad: "",
    direccion: "", // Este campo será actualizado por el componente Direccion
    municipio: "",
    interdicto: false,
    pep: false,
    consentimiento_datos: false,
    comunicaciones_comerciales: false,
    terminos_condiciones: false,
    captcha: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value.toUpperCase(),
    });
  };

  // Manejar cambios en la dirección
  const handleDireccionChange = (direccionCompleta) => {
    setFormValues({
      ...formValues,
      direccion: direccionCompleta
    });
  };

  // Manejar cambios en el reCAPTCHA
  const handleCaptchaChange = (value) => {
    setFormValues({
      ...formValues,
      captcha: !!value
    });
  };

  // Validar el formulario antes de enviarlo
  const validateForm = () => {
    if (formValues.user_pass !== formValues.confirm_user_pass) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    if (formValues.correo_electronico !== formValues.confirmar_correo) {
      setError("Los correos electrónicos no coinciden");
      return false;
    }
    if (!formValues.consentimiento_datos || !formValues.terminos_condiciones) {
      setError("Debes aceptar el uso de datos y los términos y condiciones");
      return false;
    }
    if (!formValues.captcha) {
      setError("Por favor, completa el reCAPTCHA");
      return false;
    }
    setError("");
    return true;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/clientes/registro-cliente', formValues);

      if (response.status === 200) {
        alert("Registro exitoso");
        navigate('/login-cliente');
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error en el registro");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Registro de Clientes</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Tipo de documento, número y fecha de expedición */}
        <Row>
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
                <option value="TI">Tarjeta de Identidad</option>
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
            <DatePicker
              label="Fecha de Expedición"
              value={formValues.fecha_expedicion}
              onDateChange={(date) => setFormValues({ ...formValues, fecha_expedicion: date })}
            />
          </Col>
        </Row>

        {/* Nombres y apellidos */}
        <Row className="mt-3">
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

        {/* Lugar de expedición */}
        <Row className="mt-3">
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
        </Row>

        {/* Correo electrónico y confirmación */}
        <Row className="mt-3">
          <Col md={6}>
            <Form.Group controlId="correo_electronico">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="correo_electronico"
                value={formValues.correo_electronico}
                onChange={handleInputChange}
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="confirmar_correo">
              <Form.Label>Confirmar Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="confirmar_correo"
                value={formValues.confirmar_correo}
                onChange={handleInputChange}
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Contraseña y confirmación */}
        <Row className="mt-3">
          <Col md={6}>
            <Form.Group controlId="user_pass">
              <Form.Label>Contraseña</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="user_pass"
                  value={formValues.user_pass}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <BsEyeSlash /> : <BsEye />}
                </Button>
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="confirm_user_pass">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="confirm_user_pass"
                value={formValues.confirm_user_pass}
                onChange={handleInputChange}
                required
              />             
            </Form.Group>
          </Col>
        </Row>

        {/* Teléfono móvil */}
        <Row className="mt-3">
          <Col md={4}>
            <Form.Group controlId="telefono_movil">
              <Form.Label>Teléfono Móvil</Form.Label>
              <Form.Control
                type="tel"
                name="telefono_movil"
                value={formValues.telefono_movil}
                onChange={handleInputChange}
                required
                pattern="\d{10}"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Fecha de nacimiento y género */}
        <Row className="mt-3">
          <Col md={4}>
            <DatePicker
              label="Fecha de Nacimiento"
              value={formValues.fecha_nacimiento}
              onDateChange={(date) => setFormValues({ ...formValues, fecha_nacimiento: date })}
            />
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
        </Row>

        {/* Nacionalidad */}
        <Row className="mt-3">
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

        {/* Componente de dirección */}
        <Row className="mt-3">
          <Col>
            <Direccion onDireccionCompleta={handleDireccionChange} />
          </Col>
        </Row>

        {/* Municipio */}
        <Row className="mt-3">
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

        {/* Checkboxes */}
        <Row className="mt-3">
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
        <Row className="mt-2">
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
        <Row className="mt-2">
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
        <Row className="mt-2">
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
        <Row className="mt-2">
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

        {/* Componente ReCaptcha */}
        <Row className="mt-4">
          <Col>
            <ReCaptcha onChange={handleCaptchaChange} />
          </Col>
        </Row>

        {/* Botón de envío */}
        <Row className="mt-4">
          <Col>
            <Button type="submit" variant="primary" className="w-100">
              Registrarse
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}