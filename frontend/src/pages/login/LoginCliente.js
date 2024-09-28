// src/pages/login/LoginCliente.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";
import { loginCliente } from "../../services/api"; // Importar la función de login desde api.js
import PasswordInput from "../../components/forms/PasswordInput"; // Componente para ocultar/mostrar contraseña

export default function LoginCliente() {
  
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Indicador de carga

  // Validación del formulario
  const validateForm = () => {
    if (!email || !password) {
      setError("Por favor, ingresa todos los campos.");
      return false;
    }
    setError("");
    return true;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true); // Mostrar el indicador de carga

    try {
      // Usar la función loginCliente desde services/api.js
      const response = await loginCliente(email, password);

      if (response && response.token) {
        // Guardar el token en localStorage
        localStorage.setItem('token', response.token);
        
        // Guardar la información del cliente si está disponible
        if (response.cliente) {
          localStorage.setItem('clienteInfo', JSON.stringify(response.cliente));
        }

        console.log("Login exitoso, token guardado");
        
        // Redirigir al dashboard del cliente
        navigate("/dashboard-cliente");
      } else {
        throw new Error("No se recibió un token válido");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      setError(error.message || "Error al iniciar sesión. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", paddingTop: "80px", paddingBottom: "80px" }}>
      <Container style={{ maxWidth: "500px", margin: "0 auto" }}>
        <Card className="shadow-lg text-light" style={{ backgroundColor: "#141414", borderRadius: "10px" }}>
          <Card.Body className="p-5">
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="correo_electronico" className="mb-4">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email" // Corregido
                />
              </Form.Group>

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <Row className="mt-4">
                <Col className="text-center">
                  <Button type="submit" variant="primary" className="px-5 py-2 btn-lg" disabled={loading}>
                    {loading ? "Cargando..." : "Iniciar Sesión"}
                  </Button>
                </Col>
              </Row>

              <Row className="mt-4 text-center">
                <Col>
                  <Button variant="link" className="text-light" onClick={() => navigate("/registro-cliente")}>
                    ¿No tienes cuenta? Regístrate aquí
                  </Button>
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