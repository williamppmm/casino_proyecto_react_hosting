// backend/routes/registerRoutes.js

const router = require('express').Router();
const registerController = require('../controllers/registerController');

router.post('/registro-usuario', registerController.registrarUsuario);
router.get('/verificar-autorizacion/:codigo', registerController.verificarCodigoAutorizacion);

module.exports = router;