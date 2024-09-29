// backend/index.js

// Cargar variables de entorno
require('dotenv').config();

// Detectar si el entorno es producción
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test'; // Detectar si estamos en entorno de pruebas

// console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
// console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);
// console.log('JWT_SECRET:', process.env.JWT_SECRET);

// función para que oculte parte de la cadena, en producción
function ocultarInfo(str, visibleChars = 4) {
  if (!str) return 'undefined';
  if (str.length <= visibleChars * 2) return '*'.repeat(str.length);
  return str.substr(0, visibleChars) + '*'.repeat(str.length - visibleChars * 2) + str.substr(-visibleChars);
}

console.log('SUPABASE_URL:', ocultarInfo(process.env.SUPABASE_URL, 10));
console.log('SUPABASE_ANON_KEY:', ocultarInfo(process.env.SUPABASE_ANON_KEY));
console.log('JWT_SECRET:', ocultarInfo(process.env.JWT_SECRET));

// Framework para crear aplicaciones web con Node.js
const compression = require('compression')
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

// Crear una instancia de la aplicación Express
const app = express();
const port = process.env.PORT || 5000;

// Configuración de CORS
const allowedOrigins = [
  process.env.FRONTEND_URL, // Agregado desde la variable de entorno
  'http://localhost:3000', // Permitir desarrollo local
  'https://casino-la-fortuna.vercel.app', // Dominio principal
  'https://casino-la-fortuna-git-main-william-perezs-projects-827fb858.vercel.app' // Asegúrate de incluir el dominio de Vercel
  
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir solicitudes sin origin (por ejemplo, Postman) o verificar si el origin está en la lista permitida
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      const msg = 'El CORS ha bloqueado este origen: ' + origin;
      callback(new Error(msg), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(compression());
// Middleware para parsear JSON
app.use(express.json());

// Configuración de Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const jwtSecret = process.env.JWT_SECRET;

// Función auxiliar para verificar si ya existe un cliente con el correo o número de documento
async function verificarDuplicados(correo, documento) {
  try {
    // Verificar si el correo existe
    const { data: clienteCorreo, error: errorCorreo } = await supabase
      .from('clientes')
      .select('id_cliente')
      .filter('correo_electronico', 'eq', correo);

    if (errorCorreo) throw errorCorreo;
    
    // Verificar si el documento existe
    const { data: clienteDocumento, error: errorDocumento } = await supabase
      .from('clientes')
      .select('id_cliente')
      .filter('numero_documento', 'eq', documento);

    if (errorDocumento) throw errorDocumento;

    // Si encuentra algún duplicado en cualquiera de las dos consultas, retorna verdadero
    return clienteCorreo.length > 0 || clienteDocumento.length > 0;
  } catch (error) {
    throw error;
  }
}

// Endpoint para el registro de clientes
app.post('/api/clientes/registro-cliente', async (req, res) => {
  console.log('Datos recibidos para registro:', req.body);

  try {
    const {
      tipo_documento, numero_documento, fecha_expedicion, primer_nombre, segundo_nombre,
      primer_apellido, segundo_apellido, lugar_expedicion, correo_electronico, telefono_movil,
      user_pass, fecha_nacimiento, genero, nacionalidad, direccion, municipio, interdicto,
      pep, consentimiento_datos, comunicaciones_comerciales, terminos_condiciones
    } = req.body;

    // Verificar si el cliente ya existe
    const clienteExistente = await verificarDuplicados(correo_electronico, numero_documento);
    if (clienteExistente) {
      return res.status(400).json({ error: 'El correo electrónico o número de documento ya están registrados.' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(user_pass, 10);
    const { data: nuevoCliente, error: errorInsercion } = await supabase
      .from('clientes')
      .insert([{
        tipo_documento,
        numero_documento,
        fecha_expedicion,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        lugar_expedicion,
        correo_electronico,
        telefono_movil,
        user_pass: hashedPassword,
        fecha_nacimiento,
        genero,
        nacionalidad,
        direccion,
        municipio,
        interdicto,
        pep,
        consentimiento_datos,
        comunicaciones_comerciales,
        terminos_condiciones
      }])
      .select('id_cliente')
      .single();

    if (errorInsercion) {
      console.error('Error al registrar cliente:', errorInsercion);
      return res.status(500).json({ error: isProduction ? 'Error en el servidor durante el registro.' : `Error en el registro: ${errorInsercion.message}` });
    }

    if (!nuevoCliente || !nuevoCliente.id_cliente) {
      console.error('El registro fue exitoso, pero no se devolvió el id_cliente.');
      return res.status(500).json({ error: 'Cliente registrado, pero no se devolvió el ID.' });
    }

    console.log('Cliente registrado exitosamente');
    res.status(200).json({ message: 'Cliente registrado exitosamente', id_cliente: nuevoCliente.id_cliente });

  } catch (error) {
    console.error('Error en el proceso de registro:', error);
    res.status(500).json({ error: isProduction ? 'Error en el servidor durante el registro.' : `Error en el servidor: ${error.message}` });
  }
});


// Endpoint para el login de clientes
app.post('/api/clientes/login-cliente', async (req, res) => {
  const { correo_electronico, user_pass } = req.body;
  console.log('Intento de login con:', correo_electronico);

  try {
    // Buscar al cliente en la base de datos de Supabase
    const { data: cliente, error } = await supabase
      .from('clientes')
      .select('id_cliente, correo_electronico, user_pass, primer_nombre, segundo_nombre, primer_apellido')
      .eq('correo_electronico', correo_electronico)
      .maybeSingle(); // Usa maybeSingle para evitar errores innecesarios

    // Si hay un error en la consulta
    if (error) {
      console.error('Error al buscar cliente:', error.message);
      return res.status(500).json({ error: 'Error en el servidor al buscar cliente' });
    }

    // Si no se encuentra el cliente
    if (!cliente) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Comparar las contraseñas
    const isMatch = await bcrypt.compare(user_pass, cliente.user_pass);
    if (!isMatch) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      {
        id_cliente: cliente.id_cliente,
        correo_electronico: cliente.correo_electronico,
        primer_nombre: cliente.primer_nombre,
        segundo_nombre: cliente.segundo_nombre,
        primer_apellido: cliente.primer_apellido,
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    console.log('Login exitoso, token generado:', token);

    // Devolver la respuesta exitosa
    res.status(200).json({
      message: 'Login exitoso',
      token,
      cliente: {
        id_cliente: cliente.id_cliente,
        correo_electronico: cliente.correo_electronico,
        primer_nombre: cliente.primer_nombre,
        segundo_nombre: cliente.segundo_nombre,
        primer_apellido: cliente.primer_apellido,
      }
    });

  } catch (error) {
    // Manejo de errores en caso de excepciones
    console.error('Error en el login:', error.message);
    res.status(500).json({ error: 'Error en el servidor durante el login' });
  }
});

app.get('/api/clientes/dashboard/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: cliente, error } = await supabase
      .from('clientes')
      .select('id_cliente, primer_nombre, primer_apellido, fecha_registro') // Selecciona solo los campos necesarios
      .eq('id_cliente', id)
      .single();

    if (error) throw error;

    // Devuelve solo los datos no sensibles
    res.json({
      id_cliente: cliente.id_cliente,
      primer_nombre: cliente.primer_nombre,
      primer_apellido: cliente.primer_apellido,
      fecha_registro: cliente.fecha_registro
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos del dashboard' });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
    req.userId = decoded.id_cliente;
    next();
  });
}

// Endpoints relacionados al perfil del cliente

// Endpoint para obtener los datos del cliente
app.post('/api/clientes/datos-cliente', verifyToken, async (req, res) => {
  try {
    const clienteId = req.userId;  // Extraer el ID del cliente desde el token JWT

    console.log('ID del cliente obtenido del token:', clienteId);

    // Obtener los datos del cliente en la base de datos
    const { data: cliente, error } = await supabase
      .from('clientes')
      .select(`
        id_cliente,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        fecha_registro,
        numero_documento,
        lugar_expedicion,
        nacionalidad,
        fecha_nacimiento,
        correo_electronico,
        telefono_movil,
        direccion,
        municipio
      `)
      .eq('id_cliente', clienteId)
      .maybeSingle();

    if (error) {
      console.error('Error en la consulta a la base de datos:', error.message);
      return res.status(500).json({ error: 'Error en la base de datos.' });
    }

    if (!cliente) {
      return res.status(404).json({ error: 'No se encontró el cliente con el ID proporcionado.' });
    }

    console.log('Datos del cliente obtenidos:', cliente);

    // Devolver los datos del cliente
    res.status(200).json(cliente);
  } catch (error) {
    console.error('Error en el servidor al obtener los datos del cliente:', error.message);
    res.status(500).json({ error: 'Error en el servidor al obtener los datos del cliente.' });
  }
});

// Endpoint para actualizar los datos personales del cliente
app.put('/api/clientes/actualizar-datos/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { telefono_movil, direccion, municipio, interdicto, pep } = req.body;

    // Verificar que el id del token coincida con el id solicitado
    if (req.userId !== parseInt(id)) {
      return res.status(403).json({ error: 'No tienes permiso para actualizar este perfil' });
    }

    const { data, error } = await supabase
      .from('clientes')
      .update({
        telefono_movil,
        direccion,
        municipio,
        interdicto,
        pep
      })
      .eq('id_cliente', id);

    if (error) throw error;

    res.json({ message: 'Datos actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar los datos del cliente:', error);
    res.status(500).json({ error: 'Error al actualizar los datos del cliente' });
  }
});

// Endpoint para cambiar la contraseña del cliente
app.put('/api/clientes/cambiar-contrasena/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    console.log('Cuerpo de la solicitud:', req.body);
    console.log('ID del cliente:', id);
    console.log('Contraseña actual recibida:', !!currentPassword);
    console.log('Nueva contraseña recibida:', !!newPassword);

    // Verificar que se proporcionaron todos los datos necesarios
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Se requieren la contraseña actual y la nueva contraseña' });
    }

    // Verificar que el id del token coincida con el id solicitado
    if (req.userId !== parseInt(id)) {
      return res.status(403).json({ error: 'No tienes permiso para cambiar la contraseña de este perfil' });
    }

    // Obtener el usuario actual
    const { data: usuario, error: errorUsuario } = await supabase
      .from('clientes')
      .select('user_pass')
      .eq('id_cliente', id)
      .single();

    console.log('Usuario encontrado:', !!usuario);
    console.log('Contraseña del usuario en la base de datos:', !!usuario?.user_pass);

    if (errorUsuario) {
      console.error('Error al obtener el usuario:', errorUsuario);
      return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
    }

    if (!usuario || !usuario.user_pass) {
      return res.status(404).json({ error: 'No se encontró el usuario o la contraseña no está establecida' });
    }

    // Verificar la contraseña actual
    const contrasenaValida = await bcrypt.compare(currentPassword, usuario.user_pass);
    if (!contrasenaValida) {
      return res.status(400).json({ error: 'La contraseña actual es incorrecta' });
    }

    // Validar la nueva contraseña
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ error: 'La nueva contraseña no cumple con los requisitos de seguridad' });
    }

    // Hashear la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar la contraseña en la base de datos
    const { error } = await supabase
      .from('clientes')
      .update({ user_pass: hashedPassword })
      .eq('id_cliente', id);

    if (error) {
      console.error('Error al actualizar la contraseña:', error);
      return res.status(500).json({ error: 'Error al actualizar la contraseña en la base de datos' });
    }

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor al cambiar la contraseña' });
  }
});

// endpoint para hacer cambio de correo electronico
app.put('/api/clientes/cambiar-correo/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentEmail, newEmail, password } = req.body;

    console.log('Cuerpo de la solicitud:', req.body);
    console.log('ID del cliente:', id);
    console.log('Correo actual recibido:', !!currentEmail);
    console.log('Nuevo correo recibido:', !!newEmail);
    console.log('Contraseña recibida:', !!password);

    // Verificar que se proporcionaron todos los datos necesarios
    if (!currentEmail || !newEmail || !password) {
      return res.status(400).json({ error: 'Se requieren el correo actual, el nuevo correo y la contraseña' });
    }

    // Verificar que el id del token coincida con el id solicitado
    if (req.userId !== parseInt(id)) {
      return res.status(403).json({ error: 'No tienes permiso para cambiar el correo de este perfil' });
    }

    // Obtener el usuario actual
    const { data: usuario, error: errorUsuario } = await supabase
      .from('clientes')
      .select('correo_electronico, user_pass')
      .eq('id_cliente', id)
      .single();

    console.log('Usuario encontrado:', !!usuario);

    if (errorUsuario) {
      console.error('Error al obtener el usuario:', errorUsuario);
      return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
    }

    if (!usuario || !usuario.user_pass) {
      return res.status(404).json({ error: 'No se encontró el usuario o la contraseña no está establecida' });
    }

    // Verificar que el correo actual coincida
    if (usuario.correo_electronico !== currentEmail) {
      return res.status(400).json({ error: 'El correo actual proporcionado no coincide con el registrado' });
    }

    // Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(password, usuario.user_pass);
    if (!contrasenaValida) {
      return res.status(400).json({ error: 'La contraseña es incorrecta' });
    }

    // Validar el nuevo correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ error: 'El nuevo correo electrónico no es válido' });
    }

    // Verificar si el nuevo correo ya está en uso
    const { data: existingUser, error: errorExistingUser } = await supabase
      .from('clientes')
      .select('id_cliente')
      .eq('correo_electronico', newEmail)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'El nuevo correo electrónico ya está en uso' });
    }

    // Actualizar el correo electrónico en la base de datos
    const { error } = await supabase
      .from('clientes')
      .update({ correo_electronico: newEmail })
      .eq('id_cliente', id);

    if (error) {
      console.error('Error al actualizar el correo electrónico:', error);
      return res.status(500).json({ error: 'Error al actualizar el correo electrónico en la base de datos' });
    }

    // Generar un nuevo token JWT con el correo actualizado
    const token = jwt.sign(
      { 
        userId: id, 
        email: newEmail
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Correo electrónico actualizado correctamente',
      token: token  // Enviamos el nuevo token al cliente
    });
  } catch (error) {
    console.error('Error al cambiar el correo electrónico:', error);
    res.status(500).json({ error: 'Error interno del servidor al cambiar el correo electrónico' });
  }
});

// Endpoint para dar de baja la cuenta de un cliente
app.delete('/api/clientes/darse-de-baja/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    console.log('ID del cliente:', id);
    console.log('Correo recibido:', !!email);
    console.log('Contraseña recibida:', !!password);

    // Verificar que se proporcionaron todos los datos necesarios
    if (!email || !password) {
      return res.status(400).json({ error: 'Se requieren el correo electrónico y la contraseña' });
    }

    // Verificar que el id del token coincida con el id solicitado
    if (req.userId !== parseInt(id)) {
      return res.status(403).json({ error: 'No tienes permiso para dar de baja esta cuenta' });
    }

    // Obtener el usuario actual
    const { data: usuario, error: errorUsuario } = await supabase
      .from('clientes')
      .select('correo_electronico, user_pass')
      .eq('id_cliente', id)
      .single();

    if (errorUsuario) {
      console.error('Error al obtener el usuario:', errorUsuario);
      return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
    }

    if (!usuario) {
      return res.status(404).json({ error: 'No se encontró el usuario' });
    }

    // Verificar que el correo proporcionado coincida con el registrado
    if (usuario.correo_electronico !== email) {
      return res.status(400).json({ error: 'El correo electrónico proporcionado no coincide con el registrado' });
    }

    // Verificar la contraseña
    const contrasenaValida = await bcrypt.compare(password, usuario.user_pass);
    if (!contrasenaValida) {
      return res.status(400).json({ error: 'La contraseña es incorrecta' });
    }

    // Dar de baja la cuenta (aquí podrías optar por eliminar o marcar como inactiva)
    const { error: errorBaja } = await supabase
      .from('clientes')
      .delete()
      .eq('id_cliente', id);

    if (errorBaja) {
      console.error('Error al dar de baja la cuenta:', errorBaja);
      return res.status(500).json({ error: 'Error al dar de baja la cuenta en la base de datos' });
    }

    // Si todo fue exitoso, enviar respuesta
    res.json({ message: 'Cuenta dada de baja correctamente' });
  } catch (error) {
    console.error('Error al dar de baja la cuenta:', error);
    res.status(500).json({ error: 'Error interno del servidor al dar de baja la cuenta' });
  }
});


// ---------------------------------------------------------------------------------------------------
// Consultas de prueba quedaran al final del script
// Obtener todos los clientes
// app.get('/api/clientes', async (req, res) => {
//   console.log("Obteniendo todos los clientes...");

//   try {
//     const { data: clientes, error } = await supabase
//       .from('clientes')
//       .select('*');

//     if (error) throw error;

//     res.status(200).json(clientes);
//   } catch (error) {
//     console.error('Error al obtener los clientes:', error);
//     res.status(500).json({ error: 'Error al obtener los clientes', details: error.message });
//   }
// });

// // Obtener todos los operadores
// app.get('/api/operadores', async (req, res) => {
//   console.log("Obteniendo todos los operadores...");

//   try {
//     const { data: operadores, error } = await supabase
//       .from('operadores')
//       .select('*');

//     if (error) throw error;

//     res.status(200).json(operadores);
//   } catch (error) {
//     console.error('Error al obtener los operadores:', error);
//     res.status(500).json({ error: 'Error al obtener los operadores', details: error.message });
//   }
// });

// // Obtener todas las secciones
// app.get('/api/secciones', async (req, res) => {
//   console.log("Obteniendo todas las secciones...");

//   try {
//     const { data: secciones, error } = await supabase
//       .from('secciones')
//       .select('*');

//     if (error) throw error;

//     res.status(200).json(secciones);
//   } catch (error) {
//     console.error('Error al obtener las secciones:', error);
//     res.status(500).json({ error: 'Error al obtener las secciones', details: error.message });
//   }
// });

// // Obtener todas las autorizaciones de registro
// app.get('/api/autorizaciones', async (req, res) => {
//   console.log("Obteniendo todas las autorizaciones de registro...");

//   try {
//     const { data: autorizaciones, error } = await supabase
//       .from('autorizaciones_registro')
//       .select('*');

//     if (error) throw error;

//     res.status(200).json(autorizaciones);
//   } catch (error) {
//     console.error('Error al obtener las autorizaciones:', error);
//     res.status(500).json({ error: 'Error al obtener las autorizaciones', details: error.message });
//   }
// });

// Iniciar el servidor
// Servidor inicial
// app.listen(port, () => {
//   console.log(`Servidor backend escuchando en http://localhost:${port}`);
// });

// Si no estamos en pruebas, escuchar en el puerto
if (!isTest) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
  });
}

// module.exports = app; // Exportamos la app para las pruebas