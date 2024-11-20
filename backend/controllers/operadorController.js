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
                id_operador,
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
                cargo,
                fecha_ingreso,
                seccion:id_seccion (
                    id_seccion,
                    departamento,
                    dashboard_url
                )
            `)
            .eq('id_operador', id)
            .single();

        if (error) {
            console.error('Error al obtener operador:', error);
            return res.status(500).json({ error: 'Error al consultar la base de datos' });
        }

        if (!operador) {
            return res.status(404).json({ error: 'Operador no encontrado' });
        }

        // Transformar la respuesta para mantener la estructura esperada
        const respuesta = {
            ...operador,
            seccion: {
                ...operador.seccion,
                nombre_seccion: operador.seccion.departamento // Mapear departamento a nombre_seccion si es necesario
            }
        };

        // Eliminar la propiedad departamento si no queremos que aparezca en la respuesta
        if (respuesta.seccion) {
            delete respuesta.seccion.departamento;
        }

        res.json(respuesta);
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

        // Lista de campos que el operador puede actualizar
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

        const { data: operador, error } = await supabase
            .from('operadores')
            .update(datosActualizar)
            .eq('id_operador', id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: 'Error al actualizar datos del operador' });
        }

        delete operador.user_pass;
        
        res.json(operador);
    } catch (error) {
        console.error('Error al actualizar datos del operador:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};