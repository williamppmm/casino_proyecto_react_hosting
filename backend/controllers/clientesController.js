// backend/controllers/clientesController.js

const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');

exports.obtenerDatosCliente = async (req, res) => {
    try {
        const { id, tipo } = req.usuario;
        
        if (tipo !== 'cliente') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { data: cliente, error } = await supabase
            .from('clientes')
            .select(`
                id_cliente,
                primer_nombre,
                segundo_nombre,
                primer_apellido,
                segundo_apellido,
                correo_electronico,
                telefono_movil,
                direccion,
                municipio,
                fecha_nacimiento,
                nacionalidad,
                tipo_documento,
                numero_documento,
                lugar_expedicion,
                fecha_expedicion,
                fecha_registro
            `)
            .eq('id_cliente', id)
            .single();

        if (error || !cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json(cliente);
    } catch (error) {
        console.error('Error al obtener datos del cliente:', error);
        res.status(500).json({ error: 'Error al obtener datos del cliente' });
    }
};

// Modificar datos no sensibles
exports.actualizarDatosCliente = async (req, res) => {
    try {
        const { id, tipo } = req.usuario;
        
        if (tipo !== 'cliente') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        // Lista de campos que el cliente puede actualizar
        const camposPermitidos = ['telefono_movil', 'direccion', 'municipio'];

        // Filtrar solo los campos permitidos del req.body
        const datosActualizar = {};
        for (const campo of camposPermitidos) {
            if (req.body[campo] !== undefined) {
                datosActualizar[campo] = req.body[campo];
            }
        }

        const { data: cliente, error } = await supabase
            .from('clientes')
            .update(datosActualizar)
            .eq('id_cliente', id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: 'Error al actualizar datos del cliente' });
        }

        res.json({ message: 'Información actualizada correctamente', cliente });
    } catch (error) {
        console.error('Error al actualizar datos del cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Cambiar contraseña
exports.cambiarPassword = async (req, res) => {
    try {
        console.log('Usuario autenticado:', req.usuario);

        const { id, tipo } = req.usuario;
        if (tipo !== 'cliente') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { nuevaPassword, confirmarPassword } = req.body;
        console.log('Nueva contraseña:', nuevaPassword);

        if (!nuevaPassword || !confirmarPassword) {
            return res.status(400).json({ error: 'Debe proporcionar ambas contraseñas' });
        }

        if (nuevaPassword !== confirmarPassword) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
        }

        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
        console.log('Contraseña hasheada:', hashedPassword);

        const { error } = await supabase
            .from('clientes')
            .update({ user_pass: hashedPassword })
            .eq('id_cliente', id);

        if (error) {
            console.error('Error al actualizar en la base de datos:', error);
            return res.status(500).json({ error: 'Error al actualizar la contraseña' });
        }

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Cambiar correo electrónico
exports.cambiarCorreo = async (req, res) => {
    try {
        const { id, tipo } = req.usuario;
        
        if (tipo !== 'cliente') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { nuevoCorreo, confirmarCorreo } = req.body;

        // Validaciones básicas
        if (!nuevoCorreo || !confirmarCorreo) {
            return res.status(400).json({ error: 'Debe proporcionar ambos campos de correo' });
        }

        if (nuevoCorreo !== confirmarCorreo) {
            return res.status(400).json({ error: 'Los correos no coinciden' });
        }

        // Validar formato de correo con regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(nuevoCorreo)) {
            return res.status(400).json({ error: 'Formato de correo electrónico inválido' });
        }

        // Verificar que el nuevo correo no esté en uso
        const { data: existeCorreo, error: errorBusqueda } = await supabase
            .from('clientes')
            .select('id_cliente')
            .eq('correo_electronico', nuevoCorreo)
            .single();

        if (existeCorreo) {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
        }

        // Actualizar el correo
        const { data: cliente, error } = await supabase
            .from('clientes')
            .update({ correo_electronico: nuevoCorreo })
            .eq('id_cliente', id)
            .select('id_cliente, correo_electronico')
            .single();

        if (error) {
            console.error('Error al actualizar el correo:', error);
            return res.status(400).json({ error: 'Error al actualizar el correo electrónico' });
        }

        res.json({ 
            message: 'Correo electrónico actualizado correctamente',
            cliente
        });
    } catch (error) {
        console.error('Error al cambiar el correo electrónico:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Dar de baja la cuenta
// Dar de baja la cuenta
exports.darDeBaja = async (req, res) => {
    try {
        const { id, tipo } = req.usuario;

        // Validar que el usuario tenga el rol correcto
        if (tipo !== 'cliente') {
            return res.status(403).json({ error: 'Acceso denegado: solo los clientes pueden realizar esta acción' });
        }

        // Verificar si el cliente existe
        const { data: cliente, error: errorBusqueda } = await supabase
            .from('clientes')
            .select('id_cliente')
            .eq('id_cliente', id)
            .single();

        if (errorBusqueda || !cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado en la base de datos' });
        }

        // Baja lógica del cliente (actualización del estado a inactivo)
        const { error: errorBaja } = await supabase
            .from('clientes')
            .update({ 
                activo: false, // Asegúrate de que exista el campo 'activo' en la tabla
                fecha_baja: new Date().toISOString(), // Campo para registrar la fecha de baja
                motivo_baja: req.body.motivo || 'Baja voluntaria' // Registrar motivo opcional
            })
            .eq('id_cliente', id);

        if (errorBaja) {
            console.error('Error al dar de baja la cuenta:', errorBaja);
            return res.status(500).json({ error: 'Error al procesar la baja de la cuenta en la base de datos' });
        }

        // Responder al cliente con confirmación de baja
        res.json({ 
            message: 'Cuenta dada de baja exitosamente',
            fecha_baja: new Date().toISOString(),
            motivo: req.body.motivo || 'Baja voluntaria'
        });

    } catch (error) {
        console.error('Error interno al dar de baja la cuenta:', error);
        res.status(500).json({ error: 'Error interno del servidor al procesar la baja' });
    }
};