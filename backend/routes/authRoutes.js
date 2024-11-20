// backend/routes/authRoutes.js

const router = require('express').Router();
const authController = require('../controllers/authController');

// Rutas de autenticación
router.post('/login-usuario', authController.login);
router.get('/verificar-sesion', authController.verificarToken, authController.verificarSesion);
router.post('/logout', authController.verificarToken, authController.logout);
router.post('/recuperar-contraseña', authController.recuperarContraseña);
// Rutas para recuperación de contraseña
router.post('/recuperar-password', authController.recuperarContraseña);
router.get('/verificar-token-reset/:token', authController.verificarTokenRecuperacion);
router.post('/resetear-password', authController.resetearContraseña);

module.exports = router;