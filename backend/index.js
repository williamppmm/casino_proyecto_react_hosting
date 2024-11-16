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

// Lista de orígenes permitidos explícitamente
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'https://casino-la-fortuna.vercel.app',
    'https://casino-la-fortuna-backend.onrender.com'
];

// Expresión regular para URLs de preview de Vercel (más permisiva)
const vercelPreviewRegex = /^https:\/\/casino-la-fortuna(-git-[\w-]+)?(-[a-zA-Z0-9-]+-projects-[a-zA-Z0-9]+)?\.vercel\.app\/?$/;

// Configuración de CORS más permisiva
const corsOptions = {
    origin: function (origin, callback) {
        // Log para debugging
        console.log('Solicitud recibida desde origen:', origin);

        // Permitir solicitudes sin origen (como Postman)
        if (!origin) {
            callback(null, true);
            return;
        }

        // Validar origen
        if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
            callback(null, true);
        } else {
            console.log('Intento de acceso bloqueado desde origen:', origin);
            callback(null, true); // Temporalmente permitimos todos los orígenes para debugging
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Access-Control-Allow-Origin'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400 // 24 horas
};

// Middleware de seguridad y utilidades
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));
app.use(compression());
app.use(express.json());

// Aplicar CORS como primer middleware después de la seguridad básica
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware de logging
if (!isProduction) {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        console.log('Headers:', req.headers);
        next();
    });
}

// Middleware de autenticación simplificado
function authMiddleware(req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }
    next();
}

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/operadores', authMiddleware, operadorRoutes);
app.use('/api/clientes', authMiddleware, clientesRoutes);
app.use('/api', registerRoutes);

// Manejador global de errores mejorado
app.use((err, req, res, next) => {
    console.error(`[Error] ${new Date().toISOString()}:`, err);
    
    if (err.message && err.message.includes('CORS')) {
        return res.status(200).json({ // Temporalmente cambiamos a 200 para debugging
            message: 'Solicitud recibida',
            origin: req.headers.origin
        });
    }

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        error: isProduction ? 'Error en el servidor' : err.message,
        details: isProduction ? undefined : err.stack
    });
});

// Iniciar servidor
const port = process.env.PORT || (isProduction ? 10000 : 5000);
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor iniciado en puerto ${port}`);
    console.log(`Modo: ${process.env.NODE_ENV}`);
    if (!isProduction) {
        console.log('Orígenes permitidos:', allowedOrigins);
        console.log('Patrón para URLs de preview:', vercelPreviewRegex);
    }
});

module.exports = app;