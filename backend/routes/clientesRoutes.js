// backend/routes/clientesRoutes.js

const router = require('express').Router();
const clientesController = require('../controllers/clientesController');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

// Middleware
router.use(verificarToken); // Aplica verificación de token a todas las rutas
router.use(verificarRol(['cliente'])); // Aplica verificación de rol a todas las rutas

// Rutas para clientes
router.get('/datos', clientesController.obtenerDatosCliente); // Obtener perfil del cliente
router.put('/actualizar', clientesController.actualizarDatosCliente); // Modificar datos no sensibles
router.put('/cambiar-password', clientesController.cambiarPassword); // Cambiar contraseña
router.put('/cambiar-correo', clientesController.cambiarCorreo); // Cambiar correo electrónico
router.post('/suspender-cuenta', clientesController.suspenderCuenta); // Suspender cuenta (baja lógica)

module.exports = router;