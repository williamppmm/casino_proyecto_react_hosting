// backend/routes/usuarioRoutes.js

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/registro-usuario', usuarioController.registrarUsuario);

// Nueva ruta para verificar el código de autorización
router.get('/verificar-autorizacion/:codigo', usuarioController.verificarCodigoAutorizacion);

module.exports = router;