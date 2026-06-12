const express = require('express');
const router = express.Router();
const vuiController = require('../controllers/vuiController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const os = require('os');

// Configuración de almacenamiento temporal para streams binarios de audio
const upload = multer({ 
  dest: os.tmpdir(),
  limits: { fileSize: 10 * 1024 * 1024 } // Límite máximo de 10 Megabytes por comando de voz
});

// Endpoint HTTP POST protegido por JWT para procesar audios de la app móvil
router.post('/procesar', authMiddleware, upload.single('audio'), vuiController.procesarComandoVoz);

module.exports = router;