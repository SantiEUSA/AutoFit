import React, { useState } from 'react';

export default function Dashboard() {
  // Estado mock del deportista mapeando las variables de la base de datos NoSQL
  const [atletaMetrics] = useState({
    nombre: "Santiago Ybarra",
    peso: 78.5,
    estatura: 176,
    edad: 20,
    imc: 25.34,
    grasa: 19.61, // Calculado por Deurenberg 
    tmb: 1801.45, // Calculado por Harris-Benedict 
    agua: 48.90 // Calculado por Watson 
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* Cabecera Accesible */}
      <header className="mb-10 border-b border-gray-800 pb-5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AutoFit v2 — Panel de Control Clínico</h1>
        <p className="text-gray-400 mt-2">Métricas de Composición de Masa y Músculo calculadas automáticamente por el motor de datos.</p>
      </header>

      {/* Ficha Resumen del Usuario */}
      <section className="bg-gray-800 p-6 rounded-xl mb-8 shadow-md border border-gray-700" aria-label="Información del Atleta">
        <h2 className="text-xl font-bold text-emerald-400 mb-4">🩺 Ficha del Atleta Evaluado</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div><p className="text-gray-400">Atleta:</p><p className="text-lg font-semibold">{atletaMetrics.nombre}</p></div>
          <div><p className="text-gray-400">Peso Base:</p><p className="text-lg font-semibold">{atletaMetrics.peso} kg</p></div>
          <div><p className="text-gray-400">Talla:</p><p className="text-lg font-semibold">{atletaMetrics.estatura} cm</p></div>
          <div><p className="text-gray-400">Edad:</p><p className="text-lg font-semibold">{atletaMetrics.edad} años</p></div>
        </div>
      </section>

      {/* Malla de Tarjetas Analíticas del Marco Teórico */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tarjeta 1: IMC */}
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Índice de Masa Corporal (IMC)</h3>
          <p className="text-3xl font-bold text-white mt-2">{atletaMetrics.imc}</p>
          <span className="inline-block mt-3 text-xs bg-yellow-900 text-yellow-300 px-2 py-1 rounded">Rango: Sobrepeso Leve</span>
        </div>

        {/* Tarjeta 2: Porcentaje de Grasa Corporal */}
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Grasa Corporal (Deurenberg)</h3>
          <p className="text-3xl font-bold text-orange-400 mt-2">{atletaMetrics.grasa} %</p>
          <p className="text-xs text-gray-400 mt-3">Masa adiposa relativa deducida matemáticamente.</p>
        </div>

        {/* Tarjeta 3: TMB */}
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Metabolismo Basal (TMB)</h3>
          <p className="text-3xl font-bold text-sky-400 mt-2">{atletaMetrics.tmb} kcal</p>
          <p className="text-xs text-gray-400 mt-3">Ecuación clínica de Harris-Benedict.</p>
        </div>

        {/* Tarjeta 4: Volumen de Agua Corporal */}
        <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 shadow">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Agua Corporal Total (Watson)</h3>
          <p className="text-3xl font-bold text-emerald-400 mt-2">{atletaMetrics.agua} Lt</p>
          <p className="text-xs text-gray-400 mt-3">Volumen estimado de hidratación sistémica.</p>
        </div>
      </main>
    </div>
  );
}
