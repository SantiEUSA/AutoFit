const express = require('express');
const router = express.Router();
const vuiController = require('../controllers/vuiController');
const multer = require('multer');
const os = require('os');

// Configuración de multer para procesar subidas de audio temporales
const upload = multer({ dest: os.tmpdir() });

// Endpoint HTTP POST de procesamiento VUI
router.post('/procesar', upload.single('audio'), vuiController.procesarComandoVoz);

module.exports = router;
