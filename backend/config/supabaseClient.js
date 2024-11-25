// backend/config/supabaseClient.js
// Importamos la función createClient de la librería de Supabase
const { createClient } = require('@supabase/supabase-js');

// Obtenemos las variables de entorno necesarias para la conexión
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Verificamos que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing');
    process.exit(1);
}

// Creamos y configuramos el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Exportamos el cliente para usarlo en otros archivos
module.exports = supabase;