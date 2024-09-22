// src/components/common/Navbar.js

// Importaciones necesarias
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

function NavigationBar() {
  // Obtener la ruta actual para resaltar la página activa
  const location = useLocation();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top">
      <Container>
        {/* Logo y título del casino */}
        <Navbar.Brand as={Link} to="/">
          <img
            src={require('../../assets/logos/logo.png')}
            width="40"
            height="40"
            className="d-inline-block align-top"
            alt="Logo Casino La Fortuna"
          />{' '}
          <span style={{ color: '#FFF', fontWeight: 'bold' }}>Casino La Fortuna</span>
        </Navbar.Brand>

        {/* Botón de toggle para móviles */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Enlaces de navegación */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>Inicio</Nav.Link>
            <Nav.Link as={Link} to="/quienes-somos" active={location.pathname === '/quienes-somos'}>Quiénes somos</Nav.Link>
            <Nav.Link as={Link} to="/juegos" active={location.pathname === '/juegos'}>Juegos</Nav.Link>
            <Nav.Link as={Link} to="/promociones" active={location.pathname === '/promociones'}>Promociones</Nav.Link>
            <Nav.Link as={Link} to="/contacto" active={location.pathname === '/contacto'}>Contacto</Nav.Link>
          </Nav>

          {/* Menú desplegable para iniciar sesión */}
          <Nav>
            <NavDropdown title="Inicio de sesión" id="basic-nav-dropdown" align="end">
              {/* Submenú para Clientes */}
              <NavDropdown.Header>Cliente</NavDropdown.Header>
              <NavDropdown.Item as={Link} to="/login-cliente">Iniciar sesión Cliente</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/registro-cliente">Registrarse como Cliente</NavDropdown.Item>

              <NavDropdown.Divider /> {/* Separador entre clientes y operadores */}

              {/* Submenú para Operadores */}
              <NavDropdown.Header>Operador</NavDropdown.Header>
              <NavDropdown.Item as={Link} to="/login-operador">Iniciar sesión Operador</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/registro-operador">Registrarse como Operador</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;