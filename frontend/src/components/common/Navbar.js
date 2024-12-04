// src/components/common/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    // Verificar el estado de autenticación
    const token = sessionStorage.getItem('token');
    const name = sessionStorage.getItem('user_name');
    const type = sessionStorage.getItem('user_type');

    setIsAuthenticated(!!token);
    setUserName(name || '');
    setUserType(type || '');
  }, [location]); // Se actualiza cuando cambia la ruta

  const handleLogout = () => {
    // Limpiar sessionStorage
    sessionStorage.clear();
    // Redirigir a la página de inicio
    navigate('/');
  };

  return (
    <Navbar
      bg="primary"
      variant="dark"
      expand="lg"
      fixed="top"
      expanded={expanded}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={require('../../assets/logos/logo.png')}
            width="40"
            height="40"
            className="d-inline-block align-top"
            alt="Logo Casino La Fortuna"
          />
          {/*Opcional: Cambiar el texto del span por el nombre del casino*/}
          <span style={{ color: '#FFF', fontWeight: 'bold' }}></span> 
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active={location.pathname === '/'}>
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/quienes-somos" active={location.pathname === '/quienes-somos'}>
              Quiénes somos
            </Nav.Link>
            <Nav.Link as={Link} to="/nuestros-juegos" active={location.pathname === '/nuestros-juegos'}>
              Juegos
            </Nav.Link>
            <Nav.Link as={Link} to="/promociones" active={location.pathname === '/promociones'}>
              Promociones
            </Nav.Link>
            <Nav.Link as={Link} to="/contacto" active={location.pathname === '/contacto'}>
              Contacto
            </Nav.Link>
          </Nav>

          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={`Bienvenido, ${userName}`} 
                id="basic-nav-dropdown" 
                align="end"
              >
                <NavDropdown.Item 
                  as={Link} 
                  to={userType === 'cliente' ? '/dashboard-cliente' : '/dashboard-operador'}
                >
                  Mi Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown title="Inicio de sesión" id="basic-nav-dropdown" align="end">
                <NavDropdown.Header>Bienvenido</NavDropdown.Header>
                <NavDropdown.Item as={Link} to="/login-usuario">
                  Iniciar sesión
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/registro-usuario">
                  Registrarse
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;