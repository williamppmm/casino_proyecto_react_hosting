// backend/middlewares/authMiddleware.js

const supabase = require('../config/supabaseClient');
const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT y validar que la cuenta del usuario esté activa
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar con el siguiente middleware
 */
exports.verificarToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;

        // Validar si la cuenta del usuario está activa
        const tabla = decoded.tipo === 'cliente' ? 'clientes' : 'operadores';
        const { data: usuario, error } = await supabase
            .from(tabla)
            .select('activo')
            .eq(decoded.tipo === 'cliente' ? 'id_cliente' : 'id_operador', decoded.id)
            .single();

        if (error || !usuario || !usuario.activo) {
            return res.status(403).json({ error: 'Cuenta desactivada o no autorizada' });
        }

        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

/**
 * Middleware para verificar si el usuario tiene los roles necesarios para acceder
 * @param {Array} roles - Array con los roles permitidos
 * @returns {Function} Middleware que valida los roles del usuario
 */
exports.verificarRol = (roles) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        if (!roles.includes(req.usuario.tipo)) {
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }

        next();
    };
};