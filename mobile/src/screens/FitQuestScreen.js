import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAccelerometer } from '../hooks/useAccelerometer';
import { Audio } from 'expo-av'; // Control de entrada del micrófono

export default function FitQuestScreen() {
  const { repeticiones } = useAccelerometer();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Variables de Estado de Gamificación (Octalysis UI)
  const [xp, setXp] = useState(0);
  const [nivel, setNivel] = useState(1);

  // Iniciar grabación física del micrófono nativo
  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Fallo al inicializar hardware de audio', err);
    }
  }

  // Detener grabación y procesar el envío de datos binarios hacia la API REST 
  async function stopRecording() {
    setIsRecording(false);
    if (!recording) return;

    setLoading(true);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); // Ruta local del archivo binario comprimido
    
    // Preparación del FormData Multipart para la API REST Backend
    const formData = new FormData();
    formData.append('audio', {
      uri,
      name: 'user_voice.mp4',
      type: 'audio/mp4'
    });
    formData.append('userId', 'ID_DE_USUARIO_ACTUAL_MOCK');

    try {
      const response = await fetch('http://localhost:5000/api/vui/procesar', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = await response.json();
      
      // Actualizar Gamificación de forma reactiva al recibir respuesta exitosa
      setXp(prev => {
        const nuevoXp = prev + 15;
        if (nuevoXp >= 100) {
          setNivel(n => n + 1);
          return nuevoXp - 100;
        }
        return nuevoXp;
      });
      
      alert(`Coach dice: "${data.respuesta}"`);
    } catch (error) {
      console.error('Error enviando transmisión multimedia:', error);
    } finally {
      setRecording(null);
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Panel Superior de Gamificación Reactiva */}
      <View style={styles.profileBox}>
        <Text style={styles.avatarText}>🧙‍♂️ Avatar Atleta</Text>
        <Text style={styles.statsText}>Nivel Actual: {nivel}</Text>
        <Text style={styles.xpText}>Progreso de Experiencia: {xp}/100 XP</Text>
      </View>

      {/* Panel de Conteo por Sensores de Hardware */}
      <View style={styles.hardwareBox}>
        <Text style={styles.counterTitle}>Repeticiones Detectadas por Acelerómetro</Text>
        <Text style={styles.counterNumber}>{repeticiones}</Text>
      </View>

      {/* Botón de Control de Interfaz de Voz (VUI) */}
      <TouchableOpacity 
        style={[styles.vuiButton, isRecording ? styles.recordingActive : null]}
        onPressIn={startRecording}
        onPressOut={stopRecording}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>{isRecording ? 'Escuchando...' : 'Mantén presionado para hablar con el Coach'}</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827', padding: 24, justifyContent: 'center' },
  profileBox: { backgroundColor: '#1F2937', padding: 20, borderRadius: 12, marginBottom: 24, alignItems: 'center' },
  avatarText: { fontSize: 22, color: '#fff', fontWeight: 'bold' },
  statsText: { fontSize: 18, color: '#10B981', marginTop: 8 },
  xpText: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
  hardwareBox: { backgroundColor: '#1F2937', padding: 30, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  counterTitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },
  counterNumber: { fontSize: 64, color: '#F59E0B', fontWeight: 'bold', marginTop: 10 },
  vuiButton: { backgroundColor: '#3B82F6', padding: 20, borderRadius: 50, alignItems: 'center' },
  recordingActive: { backgroundColor: '#EF4444' },
  btnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' }
});
