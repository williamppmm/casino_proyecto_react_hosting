// src/pages/dashboard/DashboardMarketing.js

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BsEnvelope, BsPeople, BsTrophy, BsMegaphone } from 'react-icons/bs';

function DashboardMarketing() {
  // KPIs principales
  const [kpis] = useState({
    clientesActivos: 1250,
    tasaRetencion: 85,
    engagementRate: 6.8,
    roiMarketing: 324
  });

  // Datos para gráficos
  const [promocionesData] = useState([
    { mes: 'Ene', nuevosClientes: 120, tasaConversion: 15 },
    { mes: 'Feb', nuevosClientes: 150, tasaConversion: 18 },
    { mes: 'Mar', nuevosClientes: 180, tasaConversion: 22 },
    { mes: 'Abr', nuevosClientes: 220, tasaConversion: 25 },
    { mes: 'May', nuevosClientes: 250, tasaConversion: 28 }
  ]);

  const [lealtadData] = useState([
    { nivel: 'Bronce', clientes: 500 },
    { nivel: 'Plata', clientes: 300 },
    { nivel: 'Oro', clientes: 150 },
    { nivel: 'Platino', clientes: 50 }
  ]);

  const [emailStats] = useState([
    { mes: 'Ene', enviados: 5000, abiertos: 2000, clicks: 800 },
    { mes: 'Feb', enviados: 5500, abiertos: 2200, clicks: 900 },
    { mes: 'Mar', enviados: 6000, abiertos: 2500, clicks: 1000 },
    { mes: 'Abr', enviados: 6500, abiertos: 2800, clicks: 1200 },
    { mes: 'May', enviados: 7000, abiertos: 3000, clicks: 1400 }
  ]);

  const [socialMediaStats] = useState([
    { red: 'Facebook', seguidores: 25000, engagement: 5.2 },
    { red: 'Instagram', seguidores: 30000, engagement: 7.8 },
    { red: 'Twitter', seguidores: 15000, engagement: 4.5 },
    { red: 'LinkedIn', seguidores: 8000, engagement: 3.2 }
  ]);

  // Colores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Componente de tarjeta de marketing con icono
  const MarketingCard = ({ title, icon: Icon, content, linkText, linkUrl, description }) => (
    <Card className="bg-dark text-white h-100">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <Icon size={24} className="me-2" />
          <Card.Title className="mb-0">{title}</Card.Title>
        </div>
        <Card.Text>{description}</Card.Text>
        <Button variant="primary" href={linkUrl}>{linkText}</Button>
      </Card.Body>
    </Card>
  );

  return (
    <section style={{ backgroundColor: '#141414', minHeight: '100vh', paddingTop: '2rem' }}>
      <Container fluid className="p-4">
        <h1 className="text-center text-white mb-4">Dashboard Marketing</h1>

        {/* KPIs */}
        <Row className="mb-4">
          <Col md={3}>
            <Card bg="primary" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Clientes Activos</Card.Title>
                <h3>{kpis.clientesActivos}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="success" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Tasa de Retención</Card.Title>
                <h3>{kpis.tasaRetencion}%</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="info" text="white" className="mb-3">
              <Card.Body>
                <Card.Title>Engagement Rate</Card.Title>
                <h3>{kpis.engagementRate}%</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card bg="warning" text="dark" className="mb-3">
              <Card.Body>
                <Card.Title>ROI Marketing</Card.Title>
                <h3>{kpis.roiMarketing}%</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Áreas principales de marketing */}
        <Row className="mb-4">
          <Col md={6} lg={3} className="mb-4">
            <MarketingCard
              title="Promociones"
              icon={BsMegaphone}
              description="Gestiona las promociones activas y crea nuevas campañas promocionales."
              linkText="Gestionar Promociones"
              linkUrl="/promotions"
            />
          </Col>
          <Col md={6} lg={3} className="mb-4">
            <MarketingCard
              title="Programa de Lealtad"
              icon={BsTrophy}
              description="Administra el programa de fidelización y sus beneficios."
              linkText="Gestionar Programa"
              linkUrl="/loyalty"
            />
          </Col>
          <Col md={6} lg={3} className="mb-4">
            <MarketingCard
              title="Email Marketing"
              icon={BsEnvelope}
              description="Crea y gestiona campañas de email marketing."
              linkText="Gestionar Emails"
              linkUrl="/email-campaigns"
            />
          </Col>
          <Col md={6} lg={3} className="mb-4">
            <MarketingCard
              title="Redes Sociales"
              icon={BsPeople}
              description="Gestiona la presencia en redes sociales."
              linkText="Ver Redes Sociales"
              linkUrl="/social-media"
            />
          </Col>
        </Row>

        {/* Gráficos de análisis */}
        <Row>
          <Col md={6} className="mb-4">
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Efectividad de Promociones</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={promocionesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="mes" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="nuevosClientes" stroke="#82ca9d" name="Nuevos Clientes" />
                      <Line type="monotone" dataKey="tasaConversion" stroke="#8884d8" name="Tasa Conversión %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Distribución Programa de Lealtad</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={lealtadData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="clientes"
                      >
                        {lealtadData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-4">
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Métricas de Email Marketing</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={emailStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="mes" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="enviados" fill="#8884d8" name="Emails Enviados" />
                      <Bar dataKey="abiertos" fill="#82ca9d" name="Emails Abiertos" />
                      <Bar dataKey="clicks" fill="#ffc658" name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="bg-dark text-white">
              <Card.Body>
                <Card.Title>Rendimiento en Redes Sociales</Card.Title>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={socialMediaStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="red" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="seguidores" fill="#8884d8" name="Seguidores" />
                      <Bar dataKey="engagement" fill="#82ca9d" name="Engagement %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default DashboardMarketing;