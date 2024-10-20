// backend/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(express.json());

app.use('/api', usuarioRoutes);

app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});