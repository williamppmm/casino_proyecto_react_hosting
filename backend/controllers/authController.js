// backend/controllers/authController.js

const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Controlador de login
exports.login = async (req, res) => {
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
        res.json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ error: 'Error al cerrar sesión' });
    }
};

// Middleware verificar token con validación de roles opcional
exports.verificarToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);

        req.usuario = decoded;

        // Validar roles si se especifican
        const rolesPermitidos = req.rolesPermitidos || [];
        if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(req.usuario.tipo)) {
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }

        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// Trabajo actual en el tema de recuperación de contraseña
// ----------------------------------------------------

// Función para solicitar recuperación de contraseña
exports.recuperarContraseña = async (req, res) => {
    const { email } = req.body;

    try {
        // Buscar al usuario en la tabla de clientes o operadores
        const { data: usuario, error } = await supabase
            .from('clientes') // Cambia a 'operadores' si aplica
            .select('id_cliente, correo_electronico')
            .eq('correo_electronico', email)
            .single();

        if (!usuario || error) {
            return res.status(404).json({ error: 'Correo no registrado.' });
        }

        // Generar un token único
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        // Insertar el token en la base de datos
        const { error: tokenError } = await supabase
            .from('password_resets')
            .insert({
                id_cliente: usuario.id_cliente, // Cambia a `id_operador` si aplica
                token,
                expires_at: expiresAt,
            });

        if (tokenError) {
            console.error('Error al guardar token:', tokenError);
            return res.status(500).json({ error: 'Error al procesar la solicitud.' });
        }

        // Configuración para enviar el correo
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Cambia según el proveedor que uses
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetUrl = `${process.env.FRONTEND_URL}/resetear-contraseña?token=${token}`;
        await transporter.sendMail({
            to: email,
            subject: 'Recuperación de contraseña',
            html: `
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>El enlace expira en 15 minutos.</p>
            `,
        });

        res.json({ message: 'Correo enviado. Revisa tu bandeja de entrada.' });
    } catch (error) {
        console.error('Error en recuperación de contraseña:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
};

// Función para verificar el token
exports.verificarTokenRecuperacion = async (req, res) => {
    const { token } = req.params;

    try {
        const { data: tokenValido, error } = await supabase
            .from('password_resets')
            .select('id_cliente, expires_at, used') // Cambia a `id_operador` si aplica
            .eq('token', token)
            .single();

        if (!tokenValido || error) {
            return res.status(400).json({ error: 'Token inválido o expirado.' });
        }

        if (tokenValido.used || new Date(tokenValido.expires_at) < new Date()) {
            return res.status(400).json({ error: 'Token inválido o expirado.' });
        }

        res.json({ valid: true });
    } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(500).json({ error: 'Error al verificar el token.' });
    }
};

// Función para restablecer la contraseña
exports.resetearContraseña = async (req, res) => {
    const { token, nueva_password, confirmar_password } = req.body;

    if (nueva_password !== confirmar_password) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
    }

    try {
        const { data: tokenValido, error } = await supabase
            .from('password_resets')
            .select('id_cliente, used') // Cambia a `id_operador` si aplica
            .eq('token', token)
            .single();

        if (!tokenValido || error || tokenValido.used) {
            return res.status(400).json({ error: 'Token inválido o expirado.' });
        }

        const hashedPassword = await bcrypt.hash(nueva_password, 10);

        // Actualizar la contraseña del usuario
        const { error: updateError } = await supabase
            .from('clientes') // Cambia a 'operadores' si aplica
            .update({ user_pass: hashedPassword })
            .eq('id_cliente', tokenValido.id_cliente);

        if (updateError) {
            return res.status(500).json({ error: 'Error al actualizar la contraseña.' });
        }

        // Marcar el token como usado
        const { error: tokenUpdateError } = await supabase
            .from('password_resets')
            .update({ used: true })
            .eq('token', token);

        if (tokenUpdateError) {
            console.error('Error al marcar token como usado:', tokenUpdateError);
        }

        res.json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
        console.error('Error al restablecer contraseña:', error);
        res.status(500).json({ error: 'Error al restablecer la contraseña.' });
    }
};