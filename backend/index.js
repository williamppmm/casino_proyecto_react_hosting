// backend/index.js

// Cargar variables de entorno
require('dotenv').config();

// Importar dependencias necesarias
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

// Importar rutas de la aplicación
const authRoutes = require('./routes/authRoutes');
const operadorRoutes = require('./routes/operadorRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const registerRoutes = require('./routes/registerRoutes');

// Crear instancia de express
const app = express();

// Detectar entorno
const isProduction = process.env.NODE_ENV === 'production';

// Configuración básica de seguridad primero
app.use(helmet({
    crossOriginResourcePolicy: false // Importante para permitir CORS
}));

// Configuración de CORS simplificada
app.use(cors({
    origin: true, // Permite todos los orígenes temporalmente
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
}));

// Asegurar que OPTIONS funcione correctamente
app.options('*', cors());

// Middleware básicos
app.use(compression());
app.use(express.json());

// Logging simple
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Origin:', req.headers.origin);
    next();
});

// Middleware de autenticación simplificado
const authMiddleware = (req, res, next) => {
    if (req.method === 'OPTIONS') return next();
    next();
};

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/operadores', authMiddleware, operadorRoutes);
app.use('/api/clientes', authMiddleware, clientesRoutes);
app.use('/api', registerRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: isProduction ? 'Error del servidor' : err.message 
    });
});

// Iniciar servidor
const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor iniciado en puerto ${port}`);
    console.log(`Modo: ${process.env.NODE_ENV}`);
});

module.exports = app;