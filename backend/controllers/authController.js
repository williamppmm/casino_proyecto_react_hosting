// backend/controllers/authController.js

const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controlador de login
exports.login = async (req, res) => {
    // logs para verificar que se reciben los datos
    console.log('Solicitud de login recibida');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    try {
        const { correo_electronico, password } = req.body;

        if (!correo_electronico || !password) {
            return res.status(400).json({ error: "Correo y contraseña son requeridos" });
        }

        // Buscar en la tabla de operadores
        let { data: operador, error: errorOperador } = await supabase
            .from('operadores')
            .select(`
                *,
                secciones:id_seccion (
                    dashboard_url
                )
            `)
            .eq('correo_electronico', correo_electronico)
            .single();

        let usuario = null;
        let tipoUsuario = '';
        let dashboardUrl = '';

        if (operador) {
            usuario = operador;
            tipoUsuario = 'operador';
            dashboardUrl = operador.secciones.dashboard_url;
        } else {
            // Buscar en la tabla de clientes
            const { data: cliente, error: errorCliente } = await supabase
                .from('clientes')
                .select('*')
                .eq('correo_electronico', correo_electronico)
                .single();

            if (cliente) {
                usuario = cliente;
                tipoUsuario = 'cliente';
                dashboardUrl = '/dashboard-cliente';
            }
        }

        if (!usuario) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        // Verificar la contraseña
        const passwordValida = await bcrypt.compare(password, usuario.user_pass);
        if (!passwordValida) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Crear token JWT
        const token = jwt.sign(
            {
                id: usuario.id_operador || usuario.id_cliente,
                tipo: tipoUsuario,
                email: usuario.correo_electronico,
                nombre: usuario.primer_nombre
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            tipo: tipoUsuario,
            nombre: `${usuario.primer_nombre} ${usuario.primer_apellido}`,
            dashboard_url: dashboardUrl
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: "Error en el proceso de login" });
    }
};

// Verificar sesión
exports.verificarSesion = async (req, res) => {
    try {
        // req.usuario ya viene del middleware verificarToken
        res.json({
            isValid: true,
            usuario: req.usuario
        });
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        res.status(500).json({ error: 'Error al verificar la sesión' });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        // En el backend solo respondemos con éxito
        // La limpieza del token se hace en el frontend
        res.json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ error: 'Error al cerrar sesión' });
    }
};

// Middleware verificar token
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
        return res.status(401).json({ error: 'Token inválido' });
    }
};