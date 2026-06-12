import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors'; // Asegura el consumo del sensor de hardware

export const useAccelerometer = (threshold = 12.0) => {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [repeticiones, setRepeticiones] = useState(0);
  const [isGoingDown, setIsGoingDown] = useState(false);

  useEffect(() => {
    // Configurar frecuencia de actualización del hardware a 100ms
    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
      
      // Calcular la magnitud vectorial del movimiento (Fuerza G total)
      const magnitud = Math.sqrt(
        accelerometerData.x ** 2 + 
        accelerometerData.y ** 2 + 
        accelerometerData.z ** 2
      ) * 9.81; // Conversión a m/s²

      // Algoritmo básico de umbral para conteo de repeticiones físicas (ej. Sentadillas)
      if (magnitud > threshold && !isGoingDown) {
        setIsGoingDown(true);
      } else if (magnitud < threshold - 2 && isGoingDown) {
        setRepeticiones(prev => prev + 1);
        setIsGoingDown(false);
      }
    });

    return () => subscription.remove();
  }, [isGoingDown, threshold]);

  return { data, repeticiones, setRepeticiones };
};
