// backend/controllers/clientesController.js
const supabase = require('../config/supabaseClient');

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

exports.actualizarDatosCliente = async (req, res) => {
    try {
        const { id, tipo } = req.usuario;
        
        if (tipo !== 'cliente') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        // Lista de campos que el cliente puede actualizar
        const camposPermitidos = [
            'telefono_movil',
            'direccion',
            'municipio'
        ];

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

        // Eliminar datos sensibles antes de enviar la respuesta
        delete cliente.user_pass;
        
        res.json(cliente);
    } catch (error) {
        console.error('Error al actualizar datos del cliente:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};