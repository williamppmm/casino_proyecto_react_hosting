import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function RegistroClientes() {
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
    telefono_movil: "",
    user_pass: "",
    confirm_user_pass: "",
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
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: name === "correo_electronico" ? value.toLowerCase() : value.toUpperCase(),
    });
  };

  const handleDateChange = (date, name) => {
    setFormValues({ ...formValues, [name]: date });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormValues({ ...formValues, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementar lógica de envío de datos y validación de reCAPTCHA aquí.
    alert("Registro exitoso");
    // Redirigir a LoginCliente
  };

  return (
    <div className="container">
      <h2>Registro de Clientes</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Tipo de Documento</label>
            <select
              className="form-control"
              name="tipo_documento"
              required
              onChange={handleInputChange}
            >
              <option value="">Seleccionar</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="TI">Tarjeta de Identidad</option>
            </select>
          </div>
          <div className="col-md-6">
            <label>Número de Documento</label>
            <input
              type="number"
              className="form-control"
              name="numero_documento"
              required
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Fecha de Expedición</label>
            <DatePicker
              selected={formValues.fecha_expedicion}
              onChange={(date) => handleDateChange(date, "fecha_expedicion")}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              required
            />
          </div>
          <div className="col-md-6">
            <label>Lugar de Expedición</label>
            <input
              type="text"
              className="form-control"
              name="lugar_expedicion"
              required
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              name="correo_electronico"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <label>Teléfono Móvil</label>
            <input
              type="tel"
              className="form-control"
              name="telefono_movil"
              pattern="\d{10}"
              title="El teléfono debe tener 10 dígitos"
              required
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Contraseña</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="user_pass"
                required
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <label>Confirmar Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              name="confirm_user_pass"
              required
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Fecha de Nacimiento</label>
            <DatePicker
              selected={formValues.fecha_nacimiento}
              onChange={(date) => handleDateChange(date, "fecha_nacimiento")}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              required
            />
          </div>
          <div className="col-md-6">
            <label>Género</label>
            <select
              className="form-control"
              name="genero"
              required
              onChange={handleInputChange}
            >
              <option value="">Seleccionar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Nacionalidad</label>
            <select
              className="form-control"
              name="nacionalidad"
              required
              onChange={handleInputChange}
            >
              <option value="CO">Colombia</option>
              <option value="US">Estados Unidos</option>
              <option value="MX">México</option>
              <option value="AR">Argentina</option>
              <option value="BR">Brasil</option>
            </select>
          </div>
          <div className="col-md-6">
            <label>Dirección</label>
            <input
              type="text"
              className="form-control"
              name="direccion"
              placeholder="Ej: Calle 123 #45-67"
              required
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="consentimiento_datos"
            required
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label">
            Acepto el uso de mis datos
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="terminos_condiciones"
            required
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label">
            Acepto los términos y condiciones
          </label>
        </div>

        <div className="mb-3">
          <div
            className="g-recaptcha"
            data-sitekey="6Ld6HUwqAAAAACu5ilbGZR7Ei_aWQxNIp1QStRoo"
          ></div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Registrarse
        </button>
      </form>
    </div>
  );
}