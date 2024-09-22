// backend/index.js

require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Configuración de Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Clave secreta para JWT (asegúrate de que esté en tu archivo .env)
const jwtSecret = process.env.JWT_SECRET || 'miclavejwtsecret';

// Endpoints

// Endpoint para el registro de clientes
app.post('/api/clientes/registro', async (req, res) => {
  console.log('Datos recibidos para registro:', req.body);

  const {
    tipo_documento, numero_documento, fecha_expedicion, primer_nombre, segundo_nombre, 
    primer_apellido, segundo_apellido, lugar_expedicion, correo_electronico, telefono_movil, 
    user_pass, fecha_nacimiento, genero, nacionalidad, direccion, municipio, interdicto, 
    pep, consentimiento_datos, comunicaciones_comerciales, terminos_condiciones, captcha
  } = req.body;

  try {
    // Verificar si el correo o el número de documento ya existen
    const { data: clienteExistente, error: errorVerificacion } = await supabase
      .from('clientes')
      .select('*')
      .or(`correo_electronico.eq.${correo_electronico},numero_documento.eq.${numero_documento}`);

    if (errorVerificacion) {
      console.error('Error en la verificación de duplicados:', errorVerificacion);
      return res.status(500).send('Error en el servidor durante la verificación.');
    }

    if (clienteExistente.length > 0) {
      console.log('Intento de registro con correo o documento duplicado');
      return res.status(400).send('El correo electrónico o número de documento ya están registrados.');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(user_pass, 10);

    // Insertar nuevo cliente
    const { data, error: errorInsercion } = await supabase
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
        terminos_condiciones,
        captcha
      }]);

    if (errorInsercion) {
      console.error('Error al registrar cliente:', errorInsercion);
      return res.status(500).send(`Error en el registro: ${errorInsercion.message}`);
    }

    console.log('Cliente registrado exitosamente');
    res.status(200).send('Cliente registrado exitosamente');
  } catch (error) {
    console.error('Error general en el proceso de registro:', error);
    res.status(500).send('Error en el servidor durante el registro.');
  }
});

// Endpoint para el login de clientes
app.post('/api/clientes/login', async (req, res) => {
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
      }
    });
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).json({ error: 'Error en el servidor al realizar el login' });
  }
});


/// Consultas de prueba quedaran al final del script
// Obtener todos los clientes
app.get('/api/clientes', async (req, res) => {
  console.log("Obteniendo todos los clientes...");

  try {
    const { data: clientes, error } = await supabase
      .from('clientes')
      .select('*');

    if (error) throw error;

    res.status(200).json(clientes);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ error: 'Error al obtener los clientes', details: error.message });
  }
});

// Obtener todos los operadores
app.get('/api/operadores', async (req, res) => {
  console.log("Obteniendo todos los operadores...");

  try {
    const { data: operadores, error } = await supabase
      .from('operadores')
      .select('*');

    if (error) throw error;

    res.status(200).json(operadores);
  } catch (error) {
    console.error('Error al obtener los operadores:', error);
    res.status(500).json({ error: 'Error al obtener los operadores', details: error.message });
  }
});

// Obtener todas las secciones
app.get('/api/secciones', async (req, res) => {
  console.log("Obteniendo todas las secciones...");

  try {
    const { data: secciones, error } = await supabase
      .from('secciones')
      .select('*');

    if (error) throw error;

    res.status(200).json(secciones);
  } catch (error) {
    console.error('Error al obtener las secciones:', error);
    res.status(500).json({ error: 'Error al obtener las secciones', details: error.message });
  }
});

// Obtener todas las autorizaciones de registro
app.get('/api/autorizaciones', async (req, res) => {
  console.log("Obteniendo todas las autorizaciones de registro...");

  try {
    const { data: autorizaciones, error } = await supabase
      .from('autorizaciones_registro')
      .select('*');

    if (error) throw error;

    res.status(200).json(autorizaciones);
  } catch (error) {
    console.error('Error al obtener las autorizaciones:', error);
    res.status(500).json({ error: 'Error al obtener las autorizaciones', details: error.message });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});