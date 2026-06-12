const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/autofit_db';
    await mongoose.connect(mongoURI);
    console.log('🛸 Conexión exitosa a MongoDB...');
  } catch (error) {
    console.error('❌ Error crítico en la conexión de base de datos:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
