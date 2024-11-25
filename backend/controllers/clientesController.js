// backend/controllers/clientesController.js

const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');

/**
 * Obtiene todos los datos personales del cliente autenticado
 * Verifica que el usuario sea de tipo cliente y obtiene sus datos de la base de datos
 */
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
/**
 * Actualiza los datos no sensibles del cliente
 * Solo permite modificar: teléfono móvil, dirección y municipio
 * Requiere verificación de contraseña para realizar los cambios
 */
exports.actualizarDatosCliente = async (req, res) => {
    try {
        const { id, tipo } = req.usuario;
        const { contrasena, ...campos } = req.body; // Separar la contraseña del resto de los campos

        if (tipo !== 'cliente') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        if (!contrasena) {
            return res.status(400).json({ error: 'La contraseña es requerida para confirmar los cambios.' });
        }

        // Obtener la contraseña almacenada del cliente
        const { data: cliente, error: fetchError } = await supabase
            .from('clientes')
            .select('user_pass') // Asegúrate de que el campo de la contraseña es 'user_pass'
            .eq('id_cliente', id)
            .single();

        if (fetchError || !cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado.' });
        }

        // Verificar la contraseña
        const contrasenaValida = await bcrypt.compare(contrasena, cliente.user_pass);

        if (!contrasenaValida) {
            return res.status(401).json({ error: 'La contraseña es incorrecta.' });
        }

        // Lista de campos que el cliente puede actualizar
        const camposPermitidos = ['telefono_movil', 'direccion', 'municipio'];

        // Filtrar solo los campos permitidos del req.body
        const datosActualizar = {};
        for (const campo of camposPermitidos) {
            if (campos[campo] !== undefined) {
                datosActualizar[campo] = campos[campo];
            }
        }

        // Actualizar los datos del cliente
        const { data: clienteActualizado, error: updateError } = await supabase
            .from('clientes')
            .update(datosActualizar)
            .eq('id_cliente', id)
            .select()
            .single();

        if (updateError) {
            return res.status(400).json({ error: 'Error al actualizar datos del cliente' });
        }

        res.json({ message: 'Información actualizada correctamente', cliente: clienteActualizado });
    } catch (error) {
        console.error('Error al actualizar datos del cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Cambiar contraseña
/**
 * Permite al cliente cambiar su contraseña
 * Requiere nueva contraseña y confirmación
 * La contraseña se almacena encriptada en la base de datos
 */
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
/**
 * Actualiza el correo electrónico del cliente
 * Verifica que el nuevo correo no esté en uso
 * Requiere confirmación del nuevo correo
 */
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
/**
 * Realiza la baja lógica de la cuenta del cliente
 * Requiere un motivo de baja
 * Registra la fecha y motivo de baja, marca la cuenta como inactiva
 */
exports.darDeBaja = async (req, res) => {
    try {
        const { id, tipo } = req.usuario;

        if (tipo !== 'cliente') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        // Validar que exista el motivo en el body
        const { motivo } = req.body;

        if (!motivo || motivo.trim() === '') {
            return res.status(400).json({ error: 'Debe proporcionar un motivo para dar de baja la cuenta' });
        }

        // Actualizar los campos relacionados con la baja lógica
        const fechaActual = new Date().toISOString();

        const { error } = await supabase
            .from('clientes')
            .update({
                activo: false,
                fecha_baja: fechaActual,
                motivo_baja: motivo
            })
            .eq('id_cliente', id);

        if (error) {
            console.error('Error al dar de baja la cuenta:', error);
            return res.status(500).json({ error: 'Error al procesar la baja de la cuenta' });
        }

        res.json({
            message: 'Cuenta dada de baja exitosamente',
            fecha_baja: fechaActual,
            motivo_baja: motivo
        });
    } catch (error) {
        console.error('Error al dar de baja la cuenta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};