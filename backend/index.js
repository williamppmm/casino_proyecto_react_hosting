// backend/index.js

// Cargar variables de entorno según el entorno de ejecución
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
 
 // Importar rutas de la aplicación
 const authRoutes = require('./routes/authRoutes');
 const operadorRoutes = require('./routes/operadorRoutes');
 const clientesRoutes = require('./routes/clientesRoutes');
 const registerRoutes = require('./routes/registerRoutes');
 
 // Crear instancia de express
 const app = express();
 
 // Lista de orígenes permitidos explícitamente
 const allowedOrigins = [
    'http://localhost:3000',               // Desarrollo local
    'https://casino-la-fortuna.vercel.app' // Producción
 ];
 
 // Expresión regular para permitir URLs de preview de Vercel
 const vercelPreviewRegex = /^https:\/\/casino-la-fortuna-git-[a-zA-Z0-9-]+-[a-zA-Z0-9-]+-projects-[a-zA-Z0-9]+\.vercel\.app\/?$/;
 
 // Configuración de CORS con validación dinámica de orígenes
 app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sin origen (ej: Postman)
        if (!origin) return callback(null, true);
        
        // Verificar si el origen está en la lista permitida o coincide con el patrón de Vercel
        if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Origen no permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
 }));
 
 // Middleware de compresión y seguridad
 app.use(compression());
 app.use(helmet());
 app.use(express.json());
 
 // Logging en desarrollo
 if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        console.log('Headers:', req.headers);
        next();
    });
 }
 
 // Habilitar pre-flight para todas las rutas
 app.options('*', cors());
 
 // Configuración de rutas de la API
 app.use('/api/auth', authRoutes);
 app.use('/api/operadores', operadorRoutes);
 app.use('/api/clientes', clientesRoutes);
 app.use('/api', registerRoutes);
 
 // Manejador global de errores con manejo específico para CORS
 app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    if (err.message === 'Origen no permitido por CORS') {
        res.status(403).json({ error: 'Acceso denegado por CORS' });
    } else {
        res.status(500).json({
            error: 'Error interno del servidor',
            message: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
 });
 
 // Iniciar servidor
 const port = process.env.PORT || 5000;
 app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
    console.log(`Modo: ${process.env.NODE_ENV}`);
    console.log(`Aceptando conexiones desde:`, allowedOrigins, 'y patrones que coincidan con', vercelPreviewRegex);
 });