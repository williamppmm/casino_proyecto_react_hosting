// backend/routes/clientesRoutes.js

const router = require('express').Router();
const clientesController = require('../controllers/clientesController');
const authController = require('../controllers/authController');
const { verificarRol } = require('../middlewares/authMiddleware');

// Aplicar verificación de token a todas las rutas
router.use(authController.verificarToken);
// Aplicar verificación de rol de cliente a todas las rutas
router.use(verificarRol(['cliente']));

// Rutas para clientes
router.get('/datos', clientesController.obtenerDatosCliente);
router.put('/actualizar', clientesController.actualizarDatosCliente);

module.exports = router;