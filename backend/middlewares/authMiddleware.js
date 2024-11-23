// backend/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

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