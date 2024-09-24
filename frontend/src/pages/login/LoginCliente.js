// src/pages/login/LoginCliente.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";
import axios from "axios";
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
      const response = await axios.post("http://localhost:5000/api/clientes/login-cliente", {
        correo_electronico: email,
        user_pass: password,
      });

      if (response.status === 200) {
        // Si el login es exitoso, redirigir al dashboard del cliente
        navigate("/dashboard-cliente");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error al iniciar sesión.");
    } finally {
      setLoading(false); // Ocultar el indicador de carga
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
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                />
              </Form.Group>

              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}