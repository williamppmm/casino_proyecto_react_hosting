// backend/controllers/usuarioController.js

const supabase = require('../config/supabaseClient');
const bcrypt = require('bcrypt');
const axios = require('axios');

async function verificarReCaptcha(token) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
        console.error('La clave secreta de reCAPTCHA no está definida.');
        return false;
    }

    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token);

    try {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', params.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        return response.data.success;
    } catch (error) {
        console.error('Error al verificar reCAPTCHA:', error);
        return false;
    }
}

exports.registrarUsuario = async (req, res) => {
    try {
        const {
            tipo_documento, numero_documento, fecha_expedicion, primer_nombre,
            segundo_nombre, primer_apellido, segundo_apellido, lugar_expedicion,
            correo_electronico, telefono_movil, user_pass, fecha_nacimiento, genero,
            nacionalidad, direccion, municipio, tipo_usuario, codigo_autorizacion,
            interdicto, pep, consentimiento_datos, comunicaciones_comerciales, terminos_condiciones,
            cargo, fecha_ingreso, recaptcha
        } = req.body;

        // Validar el reCAPTCHA
        const reCaptchaValido = await verificarReCaptcha(recaptcha);
        if (!reCaptchaValido) {
            return res.status(400).json({ error: 'Verificación de reCAPTCHA fallida' });
        }

        console.log("Datos recibidos para registro:", req.body);

        if (!tipo_documento || !numero_documento || !fecha_expedicion || !primer_nombre ||
            !primer_apellido || !lugar_expedicion || !correo_electronico || !telefono_movil ||
            !user_pass || !fecha_nacimiento || !genero || !nacionalidad || !direccion ||
            !municipio || !tipo_usuario) {
            return res.status(400).json({ error: "Datos no válidos para el registro." });
        }

        if (tipo_usuario === 'Cliente') {
            if (interdicto === undefined || pep === undefined || 
                consentimiento_datos !== true || comunicaciones_comerciales !== true || 
                terminos_condiciones !== true) {
                return res.status(400).json({ error: "Faltan campos obligatorios para el registro de cliente." });
            }
        } else if (tipo_usuario === 'Operador') {
            if (!cargo || !fecha_ingreso || !codigo_autorizacion) {
                return res.status(400).json({ error: "Faltan campos obligatorios para el registro de operador." });
            }
        } else {
            return res.status(400).json({ error: "Tipo de usuario no válido." });
        }

        const tabla = tipo_usuario === 'Operador' ? 'operadores' : 'clientes';

        // Verificar si el usuario ya existe
        const { data: usuarioExistente, error: usuarioError } = await supabase
            .from(tabla)
            .select('*')
            .or(`correo_electronico.eq.${correo_electronico},numero_documento.eq.${numero_documento}`)
            .maybeSingle();

        if (usuarioError) {
            console.error("Error al verificar si el usuario ya existe:", usuarioError);
            return res.status(500).json({ error: "Error del servidor al verificar usuario.", details: usuarioError });
        }

        if (usuarioExistente) {
            console.log("Usuario ya existe:", usuarioExistente);
            if (usuarioExistente.correo_electronico === correo_electronico) {
              return res.status(400).json({ error: "El correo electrónico ya está registrado." });
            } else if (usuarioExistente.numero_documento === numero_documento) {
              return res.status(400).json({ error: "El número de documento ya está registrado." });
            } else {
              return res.status(400).json({ error: "El usuario ya está registrado." });
            }
        }

        const hashedPassword = await bcrypt.hash(user_pass, 10);

        const nuevoUsuario = {
            tipo_documento, numero_documento, fecha_expedicion, primer_nombre,
            segundo_nombre, primer_apellido, segundo_apellido, lugar_expedicion,
            correo_electronico, telefono_movil, user_pass: hashedPassword, fecha_nacimiento,
            genero, nacionalidad, direccion, municipio
        };

        let idAutorizacion;

        if (tipo_usuario === 'Cliente') {
            Object.assign(nuevoUsuario, {
                interdicto, pep, consentimiento_datos, comunicaciones_comerciales, terminos_condiciones
            });
        } else if (tipo_usuario === 'Operador') {
            const { data: autorizacion, error: authError } = await supabase
                .from('autorizaciones_registro')
                .select('id_autorizacion, id_seccion, estado')
                .eq('codigo_autorizacion', codigo_autorizacion)
                .single();

            if (authError || !autorizacion || !autorizacion.estado) {
                return res.status(400).json({ error: "Código de autorización no válido." });
            }

            Object.assign(nuevoUsuario, {
                id_seccion: autorizacion.id_seccion,
                id_autorizacion: autorizacion.id_autorizacion,
                cargo,
                fecha_ingreso
            });

            idAutorizacion = autorizacion.id_autorizacion; // Guardamos el id de autorización para actualizar más adelante
        }

        const { error: insertError, data } = await supabase
            .from(tabla)
            .insert(nuevoUsuario)
            .select()
            .single();

        if (insertError) {
            console.error("Error al insertar usuario en la base de datos:", insertError);
            return res.status(500).json({ error: "Error al registrar el usuario.", details: insertError });
        }

        // Si el tipo de usuario es Operador, actualizar el estado del código de autorización a `false`
        if (tipo_usuario === 'Operador' && idAutorizacion) {
            const { error: updateError } = await supabase
                .from('autorizaciones_registro')
                .update({ estado: false })
                .eq('id_autorizacion', idAutorizacion);
            
            if (updateError) {
                console.error("Error al actualizar el estado del código de autorización:", updateError);
                return res.status(500).json({ error: "Error al actualizar el estado del código de autorización." });
            }
        }

        // Enviar respuesta de éxito
        res.status(201).json({ message: "Usuario registrado exitosamente", usuario: data });

    } catch (error) {
        console.error("Error general en el registro:", error);
        res.status(500).json({ error: "Error en el proceso de registro.", details: error.message });
    }
};

exports.verificarCodigoAutorizacion = async (req, res) => {
    const { codigo } = req.params;
    console.log(`Verificando código de autorización: ${codigo}`); // Verifica el código recibido
  
    try {
      const { data: autorizacion, error } = await supabase
        .from('autorizaciones_registro')
        .select('id_autorizacion, id_seccion, estado')
        .eq('codigo_autorizacion', codigo)
        .single();
  
      if (error) {
        console.error("Error en la consulta de autorización:", error);
        return res.status(500).json({ error: "Error en la consulta de autorización" });
      }
  
      if (!autorizacion) {
        console.warn("Código no encontrado o inactivo");
        return res.status(400).json({ error: "Código de autorización no válido." });
      }
  
      if (!autorizacion.estado) {
        console.warn("Código ya utilizado (estado inactivo)");
        return res.status(400).json({ error: "Código de autorización ya utilizado." });
      }
  
      console.log("Código válido, obteniendo la sección correspondiente");
  
      const { data: seccion, error: seccionError } = await supabase
        .from('secciones')
        .select('dashboard_url')
        .eq('id_seccion', autorizacion.id_seccion)
        .single();
  
      if (seccionError) {
        console.error("Error al obtener la sección:", seccionError);
        return res.status(500).json({ error: "Error al obtener la sección correspondiente." });
      }
  
      if (!seccion) {
        return res.status(404).json({ error: "Sección no encontrada." });
      }
  
      // Opcionalmente, marca el código como usado (estado: false)
      const { error: updateError } = await supabase
        .from('autorizaciones_registro')
        .update({ estado: false })
        .eq('id_autorizacion', autorizacion.id_autorizacion);
  
      if (updateError) {
        console.error("Error al actualizar el estado del código de autorización:", updateError);
        return res.status(500).json({ error: "Error al actualizar el estado del código de autorización." });
      }
  
      console.log("Código validado y url de dashboard obtenido:", seccion.dashboard_url);
      res.status(200).json({ dashboard_url: seccion.dashboard_url });
  
    } catch (error) {
      console.error('Error al verificar el código de autorización:', error);
      res.status(500).json({ error: "Error al verificar el código de autorización." });
    }
  };