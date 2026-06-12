const mongoose = require('mongoose');

/**
 * 1. SUBESQUEMA: ComposicionCorporalSchema
 * Registra el histórico antropométrico del atleta.
 * Incluye lógica automatizada para el cálculo de variables clínicas.
 */
const ComposicionCorporalSchema = new mongoose.Schema({
  fechaCaptura: { 
    type: Date, 
    default: Date.now 
  },
  pesoKg: { 
    type: Number, 
    required: [true, 'El peso en kilogramos es mandatorio.'] 
  },
  estaturaCm: { 
    type: Number, 
    required: [true, 'La estatura en centímetros es mandatoria.'] 
  },
  edad: { 
    type: Number, 
    required: [true, 'La edad cronológica es mandatoria.'],
    min: [12, 'La edad mínima permitida es de 12 años.']
  },
  sexoBiologico: { 
    type: Number, 
    enum: [0, 1], 
    required: [true, 'El sexo biológico es requerido (1 = Varón, 0 = Mujer).'] 
  },
  
  // Campos analíticos calculados automáticamente por el backend
  imc: { type: Number },
  porcentajeGrasaCorporal: { type: Number },
  tasaMetabolicaBasal: { type: Number },
  masaGrasaTotalKg: { type: Number },
  masaLibreGrasaKg: { type: Number },
  aguaCorporalTotalLt: { type: Number },
  
  // Métricas avanzadas de telemetría o Bioimpedancia (BIA)
  masaMuscularEsqueleticaBia: { type: Number, default: 0 },
  indiceGrasaVisceralBia: { type: Number, default: 0 }
});

/**
 * 2. SUBESQUEMA: VuiLogSchema
 * Mantiene la persistencia y auditoría de los comandos procesados por la interfaz de voz.
 */
const VuiLogSchema = new mongoose.Schema({
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  transcripcionEntrada: { 
    type: String, 
    required: [true, 'La transcripción de voz (STT) es obligatoria.'] 
  },
  respuestaTextoIA: { 
    type: String, 
    required: [true, 'La respuesta del modelo lingüístico (NLP) es obligatoria.'] 
  },
  audioPathServidor: { 
    type: String, 
    required: [true, 'La ruta física del archivo comprimido de salida (.mp3) es obligatoria.'] 
  },
  intencionDetectada: { 
    type: String, 
    default: 'consulta_entrenamiento',
    enum: ['consulta_entrenamiento', 'registro_metrica', 'actualizacion_avatar', 'error_pipeline'] 
  }
});

/**
 * 3. SUBESQUEMA: RutinaFisicaSchema
 * Almacena el listado adaptativo de ejercicios y tareas programadas para el usuario.
 */
const RutinaFisicaSchema = new mongoose.Schema({
  nombreActividad: { 
    type: String, 
    required: [true, 'El nombre del ejercicio es obligatorio.'], 
    trim: true 
  },
  seriesAsignadas: { 
    type: Number, 
    default: 4 
  },
  repeticionesObjetivo: { 
    type: Number, 
    required: [true, 'Las repeticiones objetivo son requeridas.'] 
  },
  repeticionesTotales: { 
    type: Number, 
    default: 0 // Sincronizado dinámicamente mediante la telemetría del acelerómetro
  },
  completada: { 
    type: Boolean, 
    default: false 
  },
  fechaProgramada: { 
    type: Date, 
    default: Date.now 
  }
});

/**
 * 4. ESQUEMA RAÍZ: UsuarioSchema
 * Entidad principal de la base de datos de AutoFit v2.
 */
const UsuarioSchema = new mongoose.Schema({
  nombreCompleto: { 
    type: String, 
    required: [true, 'El nombre completo es mandatorio.'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'El correo electrónico es un campo clave único.'], 
    unique: true, 
    lowercase: true,
    trim: true
  },
  passwordHash: { 
    type: String, 
    required: [true, 'El hash seguro de la contraseña es mandatorio para autenticación.'] 
  },
  rolPlataforma: { 
    type: String, 
    enum: ['miembro', 'entrenador', 'admin'], 
    default: 'miembro' 
  },
  
  // Estado y progreso del motor de Gamificación
  gamificacion: {
    puntosExperienciaXP: { type: Number, default: 0, min: 0 },
    nivelAvatarActual: { type: Number, default: 1, min: 1 },
    recordPuntuacionFitQuest: { type: Number, default: 0, min: 0 }
  },
  
  // Relaciones Embebidas Documentales (1:N) para optimización del rendimiento
  historialAntropometrico: [ComposicionCorporalSchema],
  planRutinas: [RutinaFisicaSchema],
  registroInteraccionesVui: [VuiLogSchema]
}, {
  timestamps: true // Genera automáticamente los campos 'createdAt' y 'updatedAt'
});

// Creación de índices compuestos para optimizar consultas de autenticación y roles
UsuarioSchema.index({ email: 1, rolPlataforma: 1 });


/**
 * 🛠️ MIDDLEWARE DE MONGOOSE (HOOK PRE-SAVE): Automatización del Marco Teórico
 * Este bloque intercepta el almacenamiento de datos antropométricos para aplicar las 
 * ecuaciones clínicas de manera automatizada antes de persistir en MongoDB.
 */
UsuarioSchema.pre('save', function (next) {
  if (this.isModified('historialAntropometrico')) {
    const registro = this.historialAntropometrico[this.historialAntropometrico.length - 1];
    
    if (registro && registro.pesoKg && registro.estaturaCm && registro.edad) {
      const estaturaMetros = registro.estaturaCm / 100;
      
      // 1. Índice de Masa Corporal (IMC)
      registro.imc = parseFloat((registro.pesoKg / Math.pow(estaturaMetros, 2)).toFixed(2));
      
      // 2. Porcentaje de Grasa Corporal (%GC) - Fórmula de Deurenberg
      registro.porcentajeGrasaCorporal = parseFloat(
        ((1.20 * registro.imc) + (0.23 * registro.edad) - (10.8 * registro.sexoBiologico) - 5.4).toFixed(2)
      );
      
      // 3. Tasa Metabólica Basal (TMB) - Ecuaciones de Harris-Benedict
      if (registro.sexoBiologico === 1) { // Hombres
        registro.tasaMetabolicaBasal = parseFloat(
          (66.473 + (13.751 * registro.pesoKg) + (5.0033 * registro.estaturaCm) - (6.755 * registro.edad)).toFixed(2)
        );
      } else { // Mujeres
        registro.tasaMetabolicaBasal = parseFloat(
          (655.095 + (9.5634 * registro.pesoKg) + (1.8496 * registro.estaturaCm) - (4.6756 * registro.edad)).toFixed(2)
        );
      }
      
      // 4. Masa Grasa Total (kg)
      registro.masaGrasaTotalKg = parseFloat(
        ((registro.pesoKg * registro.porcentajeGrasaCorporal) / 100).toFixed(2)
      );
      
      // 5. Masa Libre de Grasa (kg)
      registro.masaLibreGrasaKg = parseFloat((registro.pesoKg - registro.masaGrasaTotalKg).toFixed(2));
      
      // 6. Agua Corporal Total (ACT) - Ecuaciones de Watson
      if (registro.sexoBiologico === 1) { // Hombres
        registro.aguaCorporalTotalLt = parseFloat(
          (2.447 - (0.09156 * registro.edad) + (0.1074 * registro.estaturaCm) + (0.3362 * registro.pesoKg)).toFixed(2)
        );
      } else { // Mujeres
        registro.aguaCorporalTotalLt = parseFloat(
          (-2.097 + (0.1069 * registro.estaturaCm) + (0.2466 * registro.pesoKg)).toFixed(2)
        );
      }
    }
  }
  next();
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
