require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const conectarDB = require('./config/db');
const vuiRoutes = require('./routes/vuiRoutes');

const app = express();

// Middlewares globales de procesamiento de payloads
app.use(cors());
app.use(express.json());

// Servir la carpeta de audios de la VUI de forma pública y estática
app.use('/audio', express.static(path.join(__dirname, '../public/audio')));

// Acoplamiento de módulos de enrutamiento
app.use('/api/vui', vuiRoutes);

// Inicializar la base de datos y levantar el hilo del servidor
const PORT = process.env.PORT || 5000;

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en entorno de producción sobre el puerto: ${PORT}`);
  });
});
