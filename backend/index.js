// backend/index.js

// Cargar variables de entorno
require('dotenv').config();

// logs para verificar que se están cargando correctamente

// console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
// console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);
// console.log('JWT_SECRET:', process.env.JWT_SECRET);
// console.log('RECAPTCHA_SECRET_KEY:', process.env.RECAPTCHA_SECRET_KEY);


// función para que oculte parte de la cadena, en producción
function ocultarInfo(str, visibleChars = 4) {
  if (!str) return 'undefined';
  if (str.length <= visibleChars * 2) return '*'.repeat(str.length);
  return str.substr(0, visibleChars) + '*'.repeat(str.length - visibleChars * 2) + str.substr(-visibleChars);
}

console.log('SUPABASE_URL:', ocultarInfo(process.env.SUPABASE_URL, 10));
console.log('SUPABASE_ANON_KEY:', ocultarInfo(process.env.SUPABASE_ANON_KEY));
console.log('JWT_SECRET:', ocultarInfo(process.env.JWT_SECRET));
console.log('RECAPTCHA_SECRET_KEY:', ocultarInfo(process.env.RECAPTCHA_SECRET_KEY));

// Framework para crear aplicaciones web con Node.js // npm install express
const express = require('express');
// Backend: Librería para el hashing de contraseñas // npm install bcrypt
const bcrypt = require('bcrypt');
// Backend: Middleware para habilitar CORS en Express // npm install cors
const cors = require('cors');
// Backend: Cliente de Supabase para Node.js // npm install @supabase/supabase-js
const { createClient } = require('@supabase/supabase-js');
// Backend: Para generar y verificar tokens JWT // npm install jsonwebtoken
const jwt = require('jsonwebtoken');
// Importar el módulo axios para realizar peticiones HTTP // npm install axios
const axios = require('axios');

// Crear una instancia de la aplicación Express
const app = express();
// puerto utilizado en local al inicio del proyecto
// const port = 5000;
// MODIFICADO: Uso de variable de entorno para el puerto al desplegar en Vercel
const port = process.env.PORT || 5000;

// Configuración de CORS
// Framework web inicial al inicio del proyecto
// app.use(cors());
// MODIFICADO: Configuración de CORS más específica para producción
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // URL del frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());

// Configuración de Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Clave secreta inicial para JWT (Debe estar en .env)
// const jwtSecret = process.env.JWT_SECRET || 'miclavejwtsecreta';
// MODIFICADO: Uso exclusivo de variable de entorno para JWT_SECRET
const jwtSecret = process.env.JWT_SECRET;

// Clave secreta de reCAPTCHA (Debe estar en .env)
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Función para verificar el token de reCAPTCHA
async function verificarReCaptcha(token) {
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
    );
    return response.data.success;
  } catch (error) {
    console.error('Error al verificar reCAPTCHA:', error);
    return false;
  }
}

// Endpoints

// Endpoint para el registro de clientes
// MODIFICADO: Uso de async/await en todos los endpoints para consistencia
app.post('/api/clientes/registro-cliente', async (req, res) => {
  console.log('Datos recibidos para registro:', req.body);

  try {
    // Verificar el token de reCAPTCHA
    const reCaptchaValido = await verificarReCaptcha(req.body.captcha);
    if (!reCaptchaValido) {
      return res.status(400).json({ error: 'Verificación de reCAPTCHA fallida' });
    }
    // Extraer los campos necesarios del cuerpo de la solicitud
    const {
      tipo_documento, numero_documento, fecha_expedicion, primer_nombre, segundo_nombre,
      primer_apellido, segundo_apellido, lugar_expedicion, correo_electronico, telefono_movil,
      user_pass, fecha_nacimiento, genero, nacionalidad, direccion, municipio, interdicto,
      pep, consentimiento_datos, comunicaciones_comerciales, terminos_condiciones
    } = req.body;

    // Verificar si el correo electrónico o número de documento ya existen en la base de datos
    const clienteExistente = await verificarDuplicados(correo_electronico, numero_documento);
    if (clienteExistente) {
      return res.status(400).json({ error: 'El correo electrónico o número de documento ya están registrados.' });
    }

    // Hashear la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(user_pass, 10);

    // Insertar el nuevo cliente en la base de datos
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
      .select('id_cliente') // Asegurarse de que devuelva el id_cliente
      .single();

    if (errorInsercion) {
      console.error('Error al registrar cliente:', errorInsercion);
      return res.status(500).send(`Error en el registro: ${errorInsercion.message}`);
    }

    if (!nuevoCliente || !nuevoCliente.id_cliente) {
      console.error('El registro fue exitoso, pero no se devolvió el id_cliente.');
      return res.status(500).json({ error: 'Cliente registrado, pero no se devolvió el ID.' });
    }

    console.log('Cliente registrado exitosamente');
    res.status(200).json({ message: 'Cliente registrado exitosamente', id_cliente: nuevoCliente.id_cliente });

  } catch (error) {
    console.error('Error en el proceso de registro:', error);
    res.status(500).json({ error: 'Error en el servidor durante el registro.' });
  }
});

// Función auxiliar para verificar si ya existe un cliente con el correo o número de documento
async function verificarDuplicados(correo, documento) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .or(`correo_electronico.eq.${correo},numero_documento.eq.${documento}`);

  if (error) throw error; // Si hay un error en la consulta, lo lanzamos para que el flujo principal lo maneje
  return data.length > 0; // Devolver true si el cliente ya existe
}


// Endpoint para el login de clientes
app.post('/api/clientes/login-cliente', async (req, res) => {
  const { correo_electronico, user_pass } = req.body;

  console.log('Intento de login con:', correo_electronico);

  try {
    // Buscar al cliente por correo electrónico
    const { data: cliente, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('correo_electronico', correo_electronico)
      .single();

    if (error) {
      console.error('Error al buscar cliente:', error);
      return res.status(500).json({ error: 'Error en el servidor al buscar cliente' });
    }

    if (!cliente) {
      // Si no se encuentra el cliente
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(user_pass, cliente.user_pass);
    if (!isMatch) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Generar un token JWT con la información del cliente
    const token = jwt.sign(
      {
        id_cliente: cliente.id_cliente,
        correo_electronico: cliente.correo_electronico,
        primer_nombre: cliente.primer_nombre,
        segundo_nombre: cliente.segundo_nombre,
        primer_apellido: cliente.primer_apellido,
      },
      jwtSecret,
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    console.log('Login exitoso, token generado:', token);

    // Devolver el token y algunos datos del cliente
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
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).json({ error: 'Error en el servidor al realizar el login' });
  }
});


/// Consultas de prueba quedaran al final del script
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
// Servidor en producción
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});