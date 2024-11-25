// backend/routes/authRoutes.js

const router = require('express').Router();
const authController = require('../controllers/authController');

// Rutas de autenticación básica
router.post('/login-usuario', authController.login);
router.get('/verificar-sesion', authController.verificarToken, authController.verificarSesion);
router.post('/logout', authController.verificarToken, authController.logout);

// Rutas para recuperación y gestión de contraseña
router.post('/recuperar-password', authController.recuperarContrasena);
router.post('/cambiar-password', authController.cambiarPassword);
router.get('/verificar-token-reset/:token', authController.verificarTokenRecuperacion);
    

module.exports = router;