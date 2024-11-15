// backend/index.js

// Cargar variables de entorno según el entorno
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: '.env.development' });
} else {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const operadorRoutes = require('./routes/operadorRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const registerRoutes = require('./routes/registerRoutes');

const corsOptions = {
    origin: [
        process.env.FRONTEND_URL,
        'http://localhost:3000',
        'https://casino-la-fortuna.vercel.app',
        'https://casino-la-fortuna-git-c-0e28cf-william-perezs-projects-827fb858.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204
 };
 
 // Actualizar para manejar múltiples orígenes
 app.use(cors({
    origin: function (origin, callback) {
        if (!origin || corsOptions.origin.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: corsOptions.credentials,
    methods: corsOptions.methods,
    allowedHeaders: corsOptions.allowedHeaders
 }));

console.log('Entorno actual:', process.env.NODE_ENV);
console.log('URL del frontend:', process.env.FRONTEND_URL);

// Middleware de seguridad y optimización
app.use(compression());
app.use(helmet());
app.use(express.json());

// Log de solicitudes en desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        console.log('Headers:', req.headers);
        next();
    });
}

// Middleware para manejar las solicitudes OPTIONS
app.options('*', cors(corsOptions));

// Configuración de rutas
app.use('/api/auth', authRoutes);
app.use('/api/operadores', operadorRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api', registerRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
    console.log(`Modo: ${process.env.NODE_ENV}`);
    console.log(`Aceptando conexiones desde: ${process.env.FRONTEND_URL}`);
});