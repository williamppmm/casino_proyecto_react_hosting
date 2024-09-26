// backend/index.js

// backend/index.js

// Cargar variables de entorno
require('dotenv').config();

// Detectar si el entorno es producción
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test'; // Detectar si estamos en entorno de pruebas

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
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

// Crear una instancia de la aplicación Express
const app = express();
const port = process.env.PORT || 5000;

// Configuración de CORS
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'El CORS ha bloqueado este origen: ' + origin;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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

    const clienteExistente = await verificarDuplicados(correo_electronico, numero_documento);
    if (clienteExistente) {
      return res.status(400).json({ error: 'El correo electrónico o número de documento ya están registrados.' });
    }

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
    const { data: cliente, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('correo_electronico', correo_electronico)
      .single();

    if (error) {
      console.error('Error al buscar cliente:', error);
      return res.status(500).json({ error: isProduction ? 'Error en el servidor' : `Error: ${error.message}` });
    }

    if (!cliente) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(user_pass, cliente.user_pass);
    if (!isMatch) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

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
    console.error('Error en el login:', error);
    res.status(500).json({ error: isProduction ? 'Error en el servidor durante el login.' : `Error en el servidor: ${error.message}` });
  }
});

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
/// Iniciar el servidor solo si no estamos en modo test
if (!isTest) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
  });
}

module.exports = app; // Exportamos la app para las pruebas