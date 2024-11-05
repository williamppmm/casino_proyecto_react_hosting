// backend/routes/operadorRoutes.js

const router = require('express').Router();
const operadorController = require('../controllers/operadorController');
const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

// Aplicar verificación de token y rol de operador a todas las rutas
router.use(verificarToken);
router.use(verificarRol(['operador']));

router.get('/datos', operadorController.obtenerDatosOperador);
router.put('/actualizar', operadorController.actualizarDatosOperador);

module.exports = router;