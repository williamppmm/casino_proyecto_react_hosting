// backend/controllers/operadorController.js

const supabase = require('../config/supabaseClient');

exports.obtenerDatosOperador = async (req, res) => {
    try {
        const { id, tipo } = req.usuario;
        
        if (tipo !== 'operador') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { data: operador, error } = await supabase
            .from('operadores')
            .select(`
                *,
                seccion:id_seccion (
                    id_seccion,
                    nombre_seccion,
                    dashboard_url
                )
            `)
            .eq('id_operador', id)
            .single();

        if (error || !operador) {
            return res.status(404).json({ error: 'Operador no encontrado' });
        }

        // Eliminar datos sensibles antes de enviar
        delete operador.user_pass;
        
        res.json(operador);
    } catch (error) {
        console.error('Error al obtener datos del operador:', error);
        res.status(500).json({ error: 'Error al obtener datos del operador' });
    }
};

exports.actualizarDatosOperador = async (req, res) => {
    try {
        const { id, tipo } = req.usuario;
        
        if (tipo !== 'operador') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const { data: operador, error } = await supabase
            .from('operadores')
            .update(req.body)
            .eq('id_operador', id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: 'Error al actualizar datos del operador' });
        }

        res.json(operador);
    } catch (error) {
        console.error('Error al actualizar datos del operador:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};