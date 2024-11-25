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
        const { id, tipo } = req.usuario; // Usuario autenticado
        const { passwordActual, nuevaPassword, confirmarPassword } = req.body;

        if (tipo !== 'cliente') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        // Validaciones básicas
        if (!passwordActual || !nuevaPassword || !confirmarPassword) {
            return res.status(400).json({ error: 'Todos los campos son requeridos.' });
        }

        if (nuevaPassword !== confirmarPassword) {
            return res.status(400).json({ error: 'Las nuevas contraseñas no coinciden.' });
        }

        // Validar la política de contraseñas
        const regexPassword = /^(?=.*[A-ZÑ])(?=.*[a-zñ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-zñÑ\d@$!%*?&]{8,}$/;
        if (!regexPassword.test(nuevaPassword)) {
            return res.status(400).json({
                error: 'La nueva contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, un número y un símbolo.'
            });
        }

        // Obtener la contraseña almacenada del usuario
        const { data: cliente, error } = await supabase
            .from('clientes')
            .select('user_pass')
            .eq('id_cliente', id)
            .single();

        if (error || !cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado.' });
        }

        // Verificar la contraseña actual
        const passwordValida = await bcrypt.compare(passwordActual, cliente.user_pass);
        if (!passwordValida) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta.' });
        }

        // Encriptar la nueva contraseña
        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

        // Actualizar la contraseña en la base de datos
        const { error: updateError } = await supabase
            .from('clientes')
            .update({ user_pass: hashedPassword })
            .eq('id_cliente', id);

        if (updateError) {
            return res.status(500).json({ error: 'Error al actualizar la contraseña.' });
        }

        res.json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Cambiar correo electrónico
/**
 * Actualiza el correo electrónico del cliente
 * Verifica la contraseña actual para confirmar el cambio.
 * Verifica que el nuevo correo no esté en uso y que su formato sea válido.
 * Cierra la sesión tras el cambio exitoso.
 */
exports.cambiarCorreo = async (req, res) => {
    try {
        const { id, tipo } = req.usuario; // Información del usuario autenticado
        
        if (tipo !== 'cliente') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { nuevoCorreo, confirmarCorreo, passwordActual } = req.body;

        // Validaciones básicas
        if (!nuevoCorreo || !confirmarCorreo || !passwordActual) {
            return res.status(400).json({ error: 'Todos los campos son requeridos.' });
        }

        if (nuevoCorreo !== confirmarCorreo) {
            return res.status(400).json({ error: 'Los correos electrónicos no coinciden.' });
        }

        // Validar formato del correo con regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(nuevoCorreo)) {
            return res.status(400).json({ error: 'Formato de correo electrónico inválido.' });
        }

        // Verificar que el nuevo correo no esté en uso
        const { data: existeCorreo, error: errorBusqueda } = await supabase
            .from('clientes')
            .select('id_cliente')
            .eq('correo_electronico', nuevoCorreo)
            .single();

        if (existeCorreo) {
            return res.status(400).json({ error: 'El correo electrónico ya está en uso.' });
        }

        // Verificar la contraseña actual
        const { data: cliente, error: errorCliente } = await supabase
            .from('clientes')
            .select('user_pass')
            .eq('id_cliente', id)
            .single();

        if (errorCliente || !cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado.' });
        }

        const passwordValida = await bcrypt.compare(passwordActual, cliente.user_pass);
        if (!passwordValida) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta.' });
        }

        // Actualizar el correo
        const { error: updateError } = await supabase
            .from('clientes')
            .update({ correo_electronico: nuevoCorreo })
            .eq('id_cliente', id);

        if (updateError) {
            console.error('Error al actualizar el correo:', updateError);
            return res.status(500).json({ error: 'Error al actualizar el correo electrónico.' });
        }

        // Cerrar sesión tras el cambio
        res.json({
            message: 'Correo electrónico actualizado correctamente. Por seguridad, cierre de sesión.',
        });
    } catch (error) {
        console.error('Error al cambiar el correo electrónico:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Suspender cuenta (Baja lógica)
/**
 * Requiere correo y contraseña para confirmar la suspensión
 * Verifica el estado actual de la cuenta y registra la fecha y motivo de suspensión
 */
exports.suspenderCuenta = async (req, res) => {
    try {
        const { id, tipo } = req.usuario;

        // Verificar tipo de usuario
        if (tipo !== 'cliente') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { motivo, correo, password } = req.body;

        // Validar datos de entrada
        if (!correo || !password || !motivo) {
            return res.status(400).json({ error: 'Correo, contraseña y motivo son obligatorios.' });
        }

        // Verificar si la cuenta está activa
        const { data: cliente, error: clienteError } = await supabase
            .from('clientes')
            .select('correo_electronico, user_pass, activo')
            .eq('id_cliente', id)
            .single();

        if (clienteError) {
            console.error('Error al verificar estado de la cuenta:', clienteError);
            return res.status(500).json({ error: 'Error al verificar el estado de la cuenta.' });
        }

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado.' });
        }

        if (!cliente.activo) {
            return res.status(400).json({ error: 'La cuenta ya está suspendida.' });
        }

        // Validar correo
        if (cliente.correo_electronico !== correo) {
            return res.status(401).json({ error: 'Correo electrónico no coincide.' });
        }

        // Validar contraseña
        const passwordValida = await bcrypt.compare(password, cliente.user_pass);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Contraseña incorrecta.' });
        }

        // Suspender la cuenta
        const fechaActual = new Date().toISOString();

        const { error: updateError } = await supabase
            .from('clientes')
            .update({
                activo: false,
                fecha_baja: fechaActual,
                motivo_baja: motivo
            })
            .eq('id_cliente', id);

        if (updateError) {
            console.error('Error al suspender la cuenta:', updateError);
            return res.status(500).json({ error: 'Error al procesar la suspensión de la cuenta.' });
        }

        res.status(200).json({
            message: 'Cuenta suspendida exitosamente.',
            fecha_suspension: fechaActual,
            motivo_suspension: motivo
        });
    } catch (error) {
        console.error('Error interno al suspender la cuenta:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};