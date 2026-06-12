const OpenAI = require('openai'); 
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/Usuario');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); 

exports.procesarComandoVoz = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se suministró ningún archivo binario de audio.' });
    }

    const audioFilePath = req.file.path;
    const userId = req.body.userId; // ID del atleta enviado por el cliente móvil

    // 1. Convertir Audio a Texto (Speech-to-Text - Whisper)
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: 'whisper-1', 
    });
    
    const textoUsuario = transcription.text; 

    // 2. Procesar la intención y generar respuesta cognitiva (NLP - GPT-4o)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'Eres el coach de voz de AutoFit v2. Responde de forma motivadora, concisa y orientada al fitness.' 
        },
        { role: 'user', content: textoUsuario }
      ],
    });

    const respuestaTexto = completion.choices[0].message.content;

    // 3. Convertir Respuesta de Texto a Audio Sintetizado (Text-to-Speech - TTS)
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", 
      voice: "alloy", 
      input: respuestaTexto, 
    }); 

    // Guardar el flujo de audio en el directorio público estático del servidor
    const nombreArchivoSalida = `vui_${Date.now()}.mp3`;
    const rutaSalidaAudio = path.join(__dirname, '../../public/audio', nombreArchivoSalida);
    
    const buffer = Buffer.from(await mp3.arrayBuffer()); 
    await fs.promises.writeFile(rutaSalidaAudio, buffer); 

    // 4. Persistencia en base de datos: Registrar interacción en el histórico del usuario
    if (userId) {
      await Usuario.findByIdAndUpdate(userId, {
        $push: {
          registroInteraccionesVui: {
            transcripcionEntrada: textoUsuario,
            respuestaTextoIA: respuestaTexto,
            audioPathServidor: `/audio/${nombreArchivoSalida}`,
            intencionDetectada: 'consulta_entrenamiento'
          }
        },
        $inc: { 'gamificacion.puntosExperienciaXP': 15 } // Otorga XP por usar comandos de voz (Gamificación)
      });
    }

    // Limpiar el audio temporal de entrada subido por el cliente
    if (fs.existsSync(audioFilePath)) {
      fs.unlinkSync(audioFilePath);
    }

    // Responder al cliente móvil con los textos y la ruta del flujo de audio resultante
    return res.status(200).json({
      transcripcion: textoUsuario,
      respuesta: respuestaTexto,
      audioUrl: `/audio/${nombreArchivoSalida}`
    });

  } catch (error) {
    console.error('Error en la pipeline VUI:', error);
    return res.status(500).json({ error: 'Fallo interno en el procesamiento del pipeline VUI.' });
  }
};
