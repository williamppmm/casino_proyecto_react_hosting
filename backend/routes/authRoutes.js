// backend/routes/authRoutes.js

const router = require('express').Router();
const authController = require('../controllers/authController');

// Rutas de autenticación
router.post('/login-usuario', authController.login);
router.get('/verificar-sesion', authController.verificarToken, authController.verificarSesion);
router.post('/logout', authController.verificarToken, authController.logout);

module.exports = router;