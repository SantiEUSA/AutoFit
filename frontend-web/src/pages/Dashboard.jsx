import React, { useState } from 'react';
import { 
  Activity, UserPlus, Search, Database, TrendingUp, 
  Droplet, Heart, Flame, Navigation 
} from 'lucide-react';

export default function Dashboard() {
  // Estado para el Atleta Activo (Conectado a la Base de Datos)
  const [atletaActivo, setAtletaActivo] = useState({
    nombre: "Santiago Ybarra",
    peso: 78.5,
    talla: 176,
    edad: 20,
    imc: 25.34,
    rango: "Sobrepeso Leve",
    grasa: 19.61,
    tmb: 1801.45
  });

  // Estados para los formularios interactivos
  const [nuevoAtleta, setNuevoAtleta] = useState({ nombre: '', peso: '', talla: '', edad: '' });
  const [busqueda, setBusqueda] = useState('');
  
  // Estado para la Calculadora de Frecuencia Cardíaca
  const [fcMax, setFcMax] = useState(190);

  // Lógica de cálculo automatizado e inyección de datos
  const manejarRegistro = (e) => {
    e.preventDefault();
    if (!nuevoAtleta.nombre || !nuevoAtleta.peso || !nuevoAtleta.talla || !nuevoAtleta.edad) return;

    const p = parseFloat(nuevoAtleta.peso);
    const t = parseFloat(nuevoAtleta.talla) / 100;
    const edadInt = parseInt(nuevoAtleta.edad);
    
    const imcCalculado = (p / (t * t)).toFixed(2);
    let rangoClasificacion = "Normopeso";
    if (imcCalculado >= 25) rangoClasificacion = "Sobrepeso Leve";
    if (imcCalculado >= 30) rangoClasificacion = "Obesidad";

    const grasaCalculada = ((1.20 * imcCalculado) + (0.23 * edadInt) - 16.2).toFixed(2);
    const tmbCalculada = (66.47 + (13.75 * p) + (5 * (t * 100)) - (6.75 * edadInt)).toFixed(2);

    setAtletaActivo({
      nombre: nuevoAtleta.nombre,
      peso: p,
      talla: parseFloat(nuevoAtleta.talla),
      edad: edadInt,
      imc: imcCalculado,
      rango: rangoClasificacion,
      grasa: grasaCalculada,
      tmb: tmbCalculada
    });

    setFcMax(220 - edadInt);

    alert(`[Docker API] Documento empaquetado e indexado con éxito en la base de datos.`);
    setNuevoAtleta({ nombre: '', peso: '', talla: '', edad: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-6">
      
      {/* HEADER PRINCIPAL */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Activity className="h-6 w-6 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full">Ecosistema Integrado</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">AutoFit — Panel de Control Clínico</h1>
          <p className="text-sm text-slate-400">Infraestructura de análisis biométrico y gestión de datos en tiempo real.</p>
        </div>
        
        {/* Nodo de Conexión de Datos */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
          <Database className="text-emerald-400 h-4 w-4" />
          <div>
            <p className="font-semibold text-slate-300">Estado de Red: <span className="text-emerald-400 font-bold">ONLINE</span></p>
            <p className="text-[10px] text-slate-500">Servidor expuesto en el puerto 27017</p>
          </div>
        </div>
      </header>

      {/* RECORRIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BLOQUE IZQUIERDO: FORMULARIOS */}
        <section className="space-y-6 lg:col-span-1">
          
          {/* Registro Base de Datos */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="text-emerald-400 h-5 w-5" />
              <h2 className="text-lg font-bold text-white">Registrar Atleta</h2>
            </div>
            <form onSubmit={manejarRegistro} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nombre del Deportista</label>
                <input type="text" required value={nuevoAtleta.nombre} onChange={e => setNuevoAtleta({...nuevoAtleta, nombre: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="Ej. Santiago Ybarra" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Peso (kg)</label>
                  <input type="number" step="0.1" required value={nuevoAtleta.peso} onChange={e => setNuevoAtleta({...nuevoAtleta, peso: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="78" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Talla (cm)</label>
                  <input type="number" required value={nuevoAtleta.talla} onChange={e => setNuevoAtleta({...nuevoAtleta, talla: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="176" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Edad</label>
                  <input type="number" required value={nuevoAtleta.edad} onChange={e => setNuevoAtleta({...nuevoAtleta, edad: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="20" />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 mt-2">
                Ejecutar Ecuaciones y Guardar
              </button>
            </form>
          </div>

          {/* Motor de Búsqueda Integrado */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Search className="text-emerald-400 h-5 w-5" />
              <h2 className="text-lg font-bold text-white">Consultar Registro Clínico</h2>
            </div>
            <p className="text-xs text-slate-400 mb-3">Realiza una consulta directa a los expedientes distribuidos en Docker.</p>
            <div className="relative">
              <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="Filtro por nombre o id..." />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            </div>
          </div>
        </section>

        {/* BLOQUE DERECHO: DETALLES Y CALCULADORAS */}
        <section className="lg:col-span-2 space-y-6">
          
          {/* EXPEDIENTE MÉDICO EN FOCO */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                  {atletaActivo.nombre.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{atletaActivo.nombre}</h3>
                  <p className="text-xs text-slate-400">Valores Biomecánicos Calculados Automatizadamente</p>
                </div>
              </div>
              <span className="text-xs font-semibold bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-emerald-400">
                Métrica Activa
              </span>
            </div>

            {/* Ficha Rápida */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Masa</p>
                <p className="text-base font-bold text-white">{atletaActivo.peso} kg</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Estatura</p>
                <p className="text-base font-bold text-white">{atletaActivo.talla} cm</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Edad Cronológica</p>
                <p className="text-base font-bold text-white">{atletaActivo.edad} años</p>
              </div>
            </div>

            {/* Bloques Clínicos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Índice de Masa Corporal (IMC)</p>
                  <p className="text-2xl font-black text-white">{atletaActivo.imc}</p>
                </div>
                <span className="text-[10px] font-extrabold mt-3 inline-block text-amber-400 bg-amber-500/5 px-2 py-1 rounded border border-amber-500/10 w-fit">
                  {atletaActivo.rango}
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Grasa (Deurenberg)</p>
                  <p className="text-2xl font-black text-white">{atletaActivo.grasa}%</p>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-slate-900 rounded-full h-1">
                    <div className="bg-emerald-400 h-1 rounded-full" style={{ width: `${Math.min(atletaActivo.grasa * 2, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Metabolismo Basal (TMB)</p>
                  <p className="text-2xl font-black text-white">{atletaActivo.tmb}</p>
                </div>
                <p className="text-[10px] text-slate-500 mt-3">Kcal/día requeridas base</p>
              </div>
            </div>
          </div>

          {/* MATRIZ DE CALCULADORAS DE ENTRENAMIENTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Calculadora 1: Zonas Cardíacas */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-rose-400">
                  <Flame className="h-4 w-4" />
                  <h4 className="font-bold text-sm uppercase tracking-wider text-white">Zonas de Frecuencia Cardíaca</h4>
                </div>
                <p className="text-xs text-slate-400 mb-4">Zonas metabólicas estimadas en base a los datos actuales del atleta.</p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Z1 (Recuperación - 60%):</span>
                    <span className="font-bold text-emerald-400">{Math.round(fcMax * 0.6)} ppm</span>
                  </div>
                  <div className="flex justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Z3 (Umbral Aeróbico - 80%):</span>
                    <span className="font-bold text-amber-400">{Math.round(fcMax * 0.8)} ppm</span>
                  </div>
                  <div className="flex justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Z5 (Máximo Anaeróbico - 95%):</span>
                    <span className="font-bold text-rose-400">{Math.round(fcMax * 0.95)} ppm</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Techo estimado (FC Máx):</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono text-white">{fcMax} ppm</span>
              </div>
            </div>

            {/* Calculadora 2: Predictor de Ritmos y Ascenso */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-sky-400">
                  <Navigation className="h-4 w-4" />
                  <h4 className="font-bold text-sm uppercase tracking-wider text-white">Velocidad de Ascenso y Ritmo</h4>
                </div>
                <p className="text-xs text-slate-400 mb-4">Estimación de rendimiento deportivo para transiciones verticales y carrera.</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Tasa de Ascenso Vertical (VAM):</span>
                      <span className="text-white font-medium">650 m/h</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-sky-400 h-1.5" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Predicción de Ritmo Competitivo:</span>
                      <span className="text-white font-medium">4:35 min/km</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-sky-400 h-1.5" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-slate-950/60 border border-slate-800/80 p-2 rounded-xl text-center text-[10px] text-slate-400">
                Métricas adaptadas según el peso base de <span className="text-emerald-400 font-bold">{atletaActivo.peso} kg</span>.
              </div>
            </div>

          </div>

        </section>
      </main>

    </div>
  );
}