// Cargar variables de entorno
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: '.env.development' });
} else {
    require('dotenv').config();
}

// Importar dependencias necesarias
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

// Crear instancia de express
const app = express();

// Configuración de puertos según el entorno
const port = process.env.PORT || (process.env.NODE_ENV === 'production' ? 10000 : 5000);

// **Inicio de reintegración de funcionalidad de CORS**

// Lista de orígenes permitidos explícitamente
const allowedOrigins = [
    'http://localhost:3000',                 // Desarrollo local
    'https://casino-la-fortuna.vercel.app',  // Producción
    /^https:\/\/casino-la-fortuna(-git-[\w-]+)?(-[a-zA-Z0-9-]+-projects-[a-zA-Z0-9]+)?\.vercel\.app\/?$/ // Vercel previews
];

// Expresión regular para validación de orígenes
const vercelPreviewRegex = /^https:\/\/casino-la-fortuna(-git-[\w-]+)?(-[a-zA-Z0-9-]+-projects-[a-zA-Z0-9]+)?\.vercel\.app\/?$/;

// Configuración de CORS con validación dinámica de orígenes
app.use(cors({
    origin: (origin, callback) => {
        console.log('CORS request received. Origin:', origin);

        // Permitir solicitudes sin origen (por ejemplo, Postman o herramientas locales)
        if (!origin) {
            console.log('Permitiendo solicitud sin origen.');
            return callback(null, true);
        }

        // Verificar si el origen está explícitamente permitido o coincide con el patrón de Vercel
        if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
            console.log('Permitiendo origen:', origin);
            callback(null, true);
        } else {
            console.warn('Origen no permitido por CORS:', origin);
            callback(new Error(`Origen no permitido por CORS: ${origin}`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
}));
// **Fin de reintegración de funcionalidad de CORS**

// **Inicio de integración de Helmet**
app.use(helmet({
    crossOriginResourcePolicy: false, // Deshabilitar restricciones para recursos con CORS
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://casino-la-fortuna.vercel.app"],
            connectSrc: ["'self'", "https://casino-la-fortuna-backend.onrender.com"],
            imgSrc: ["'self'", "data:", "https:"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            fontSrc: ["'self'", "https:"],
        },
    },
}));
// **Fin de integración de Helmet**

// Middleware de compresión y seguridad
app.use(compression());
app.use(helmet());
app.use(express.json());

// Logs adicionales para solicitudes (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`Nueva solicitud: ${req.method} ${req.url}`);
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        next();
    });
}

// Configuración de rutas de la API
const authRoutes = require('./routes/authRoutes');
const operadorRoutes = require('./routes/operadorRoutes');
const clientesRoutes = require('./routes/clientesRoutes');
const registerRoutes = require('./routes/registerRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/operadores', operadorRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api', registerRoutes);

// Endpoint raíz para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('El servidor backend está funcionando correctamente.');
});

// Manejador global de errores con manejo específico para CORS
app.use((err, req, res, next) => {
    console.error('Error global capturado:', err.stack);
    if (err.message.includes('CORS')) {
        res.status(403).json({ error: 'Acceso denegado por CORS', details: err.message });
    } else {
        res.status(500).json({
            error: 'Error interno del servidor',
            message: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
    console.log(`Modo: ${process.env.NODE_ENV}`);
    console.log(`Orígenes permitidos:`, allowedOrigins);
});