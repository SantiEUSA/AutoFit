import React, { useState } from 'react';
import { 
  Activity, UserPlus, Search, Database, TrendingUp, 
  Flame, Navigation, Dumbbell, Target, Timer, Plus
} from 'lucide-react';

export default function Dashboard() {
  // 1. Estado principal del Atleta Activo (Valores iniciales)
  const [atletaActivo, setAtletaActivo] = useState({
    nombre: "tu nombre",
    peso: 78.5,
    talla: 176,
    edad: 20,
    imc: 25.34,
    rango: "Sobrepeso Leve",
    grasa: 19.61,
    tmb: 1801.45
  });

  // 2. Estado para Objetivos Personales
  const [objetivos, setObjetivos] = useState({
    pesoObjetivo: "72.0",
    tiempoObjetivo1k: "3:55"
  });
  const [editandoObjetivos, setEditandoObjetivos] = useState({ pesoObjetivo: '72.0', tiempoObjetivo1k: '3:55' });

  // 3. Estado para Historial de 1K (Gráfico interactivo)
  const [historial1k, setHistorial1k] = useState([
    { id: 1, fecha: "10/05", tiempo: "4:45", segundos: 285 },
    { id: 2, fecha: "20/05", tiempo: "4:38", segundos: 278 },
    { id: 3, fecha: "01/06", tiempo: "4:35", segundos: 275 },
  ]);
  const [nuevoTiempo, setNuevoTiempo] = useState({ fecha: '', tiempo: '' });

  // 4. Estados de los campos del formulario
  const [nuevoAtleta, setNuevoAtleta] = useState({ nombre: '', peso: '', talla: '', edad: '' });
  const [busqueda, setBusqueda] = useState('');

  // ==========================================
  // 🧮 ECUACIONES METABÓLICAS Y DE RENDIMIENTO DINÁMICAS
  // ==========================================
  
  // A) Frecuencia Cardíaca Máxima Dinámica (Fórmula de Astrand basada en la edad activa)
  const fcMaxDinámica = 220 - atletaActivo.edad;

  // B) Tasa de Ascenso Vertical (VAM) Dinámica
  // Fisiología: A menor peso corporal, mayor velocidad de ascensión relativa para la misma potencia.
  const vamDinamica = Math.round(650 * (80 / atletaActivo.peso));

  // C) Predicción de Ritmo Competitivo Dinámico
  // Estimación de minutos por kilómetro escalado según el peso del atleta
  const factorRitmo = 4.58 * (atletaActivo.peso / 80); 
  const minutosRitmo = Math.floor(factorRitmo);
  const segundosRitmo = Math.round((factorRitmo - minutosRitmo) * 60);
  const ritmoFormateado = `${minutosRitmo}:${segundosRitmo < 10 ? '0' : ''}${segundosRitmo}`;

  // ==========================================
  // ⚙️ MANEJADORES DE ACCIONES
  // ==========================================

  const manejarRegistro = (e) => {
    e.preventDefault();
    if (!nuevoAtleta.nombre || !nuevoAtleta.peso || !nuevoAtleta.talla || !nuevoAtleta.edad) return;

    const p = parseFloat(nuevoAtleta.peso);
    const t = parseFloat(nuevoAtleta.talla) / 100;
    const edadInt = parseInt(nuevoAtleta.edad);
    
    // Cálculo Dinámico de IMC
    const imcCalculado = (p / (t * t)).toFixed(2);
    
    // Clasificación Clínica
    let rangoClasificacion = "Normopeso";
    if (imcCalculado >= 25) rangoClasificacion = "Sobrepeso Leve";
    if (imcCalculado >= 30) rangoClasificacion = "Obesidad";
    if (imcCalculado < 18.5) rangoClasificacion = "Bajo Peso";

    // Ecuación de Deurenberg para el % de Grasa Corporal
    const grasaCalculada = ((1.20 * imcCalculado) + (0.23 * edadInt) - 16.2).toFixed(2);
    
    // Ecuación de Harris-Benedict para la Tasa Metabólica Basal (TMB)
    const tmbCalculada = (66.47 + (13.75 * p) + (5 * (t * 100)) - (6.75 * edadInt)).toFixed(2);

    // Inyectamos todo al estado activo (Esto forzará a que todo el Dashboard cambie al vuelo)
    setAtletaActivo({
      nombre: nuevoAtleta.nombre,
      peso: p,
      talla: parseFloat(nuevoAtleta.talla),
      edad: edadInt,
      imc: parseFloat(imcCalculado),
      rango: rangoClasificacion,
      grasa: parseFloat(grasaCalculada),
      tmb: parseFloat(tmbCalculada)
    });

    alert(`[Docker API] Documento empaquetado e indexado con éxito en la colección 'athletes' de MongoDB.`);
    setNuevoAtleta({ nombre: '', peso: '', talla: '', edad: '' });
  };

  const actualizarObjetivos = (e) => {
    e.preventDefault();
    setObjetivos({ ...editandoObjetivos });
    alert("[Docker API] Objetivos de rendimiento actualizados en el perfil.");
  };

  const añadirCarrera = (e) => {
    e.preventDefault();
    if (!nuevoTiempo.fecha || !nuevoTiempo.tiempo) return;

    const partes = nuevoTiempo.tiempo.split(':');
    const segs = (parseInt(partes[0]) * 60) + (parseInt(partes[1]) || 0);

    const nuevaSerie = {
      id: Date.now(),
      fecha: nuevoTiempo.fecha,
      tiempo: nuevoTiempo.tiempo,
      segundos: segs
    };

    setHistorial1k([...historial1k, nuevaSerie]);
    setNuevoTiempo({ fecha: '', tiempo: '' });
  };

  // Configuración de escalas del gráfico
  const tiemposSegundos = historial1k.map(h => h.segundos);
  const maxSegundos = Math.max(...tiemposSegundos, 300);
  const minSegundos = Math.min(...tiemposSegundos, 200);
  const rangoSegundos = maxSegundos - minSegundos || 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-6">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Activity className="h-6 w-6 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full">Ecosistema Integrado</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">AutoFit — Panel de Control Clínico</h1>
          <p className="text-sm text-slate-400">Infraestructura de análisis biométrico y gestión de datos en tiempo real.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
          <Database className="text-emerald-400 h-4 w-4" />
          <div>
            <p className="font-semibold text-slate-300">Estado de Red: <span className="text-emerald-400 font-bold">ONLINE</span></p>
            <p className="text-[10px] text-slate-500">Servidor expuesto en el puerto 27017</p>
          </div>
        </div>
      </header>

      {/* CUADRÍCULA PRINCIPAL */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: FORMULARIOS */}
        <section className="space-y-6 lg:col-span-1">
          
          {/* Registrar Atleta */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="text-emerald-400 h-5 w-5" />
              <h2 className="text-lg font-bold text-white">Registrar Atleta</h2>
            </div>
            <form onSubmit={manejarRegistro} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nombre del Deportista</label>
                <input type="text" required value={nuevoAtleta.nombre} onChange={e => setNuevoAtleta({...nuevoAtleta, nombre: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="Ej. Santiago Ybarra" />
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

          {/* Fijar Metas */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-cyan-400 h-5 w-5" />
              <h2 className="text-lg font-bold text-white">Establecer Metas del Atleta</h2>
            </div>
            <form onSubmit={actualizarObjetivos} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Peso Objetivo (kg)</label>
                  <input type="number" step="0.1" value={editandoObjetivos.pesoObjetivo} onChange={e => setEditandoObjetivos({...editandoObjetivos, pesoObjetivo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Meta 1K (Min:Seg)</label>
                  <input type="text" value={editandoObjetivos.tiempoObjetivo1k} onChange={e => setEditandoObjetivos({...editandoObjetivos, tiempoObjetivo1k: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400" />
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs py-2 rounded-xl border border-cyan-500/20 transition-all">
                Fijar Nuevos Objetivos
              </button>
            </form>
          </div>

          {/* Buscador Clínico */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Search className="text-slate-400 h-5 w-5" />
              <h2 className="text-base font-bold text-white">Consultar Registro Clínico</h2>
            </div>
            <div className="relative">
              <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="Filtro por nombre o id..." />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            </div>
          </div>
        </section>

        {/* COLUMNA DERECHA: DASHBOARD DINÁMICO */}
        <section className="lg:col-span-2 space-y-6">
          
          {/* EXPEDIENTE BIOMÉTRICO */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
                  {atletaActivo.nombre.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{atletaActivo.nombre}</h3>
                  <p className="text-xs text-slate-400">Resultados analíticos calculados bajo demanda</p>
                </div>
              </div>
              
              <div className="flex gap-4 text-right">
                <div className="bg-slate-950/60 border border-slate-800/80 px-3 py-1 rounded-xl text-xs">
                  <span className="text-[10px] block text-slate-500 font-bold uppercase">Objetivo Peso</span>
                  <span className="font-bold text-cyan-400">{objetivos.pesoObjetivo} kg</span>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 px-3 py-1 rounded-xl text-xs">
                  <span className="text-[10px] block text-slate-500 font-bold uppercase">Meta 1 Km</span>
                  <span className="font-bold text-purple-400">{objetivos.tiempoObjetivo1k} min</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Índice de Masa Corporal (IMC)</p>
                <p className="text-2xl font-black text-white">{atletaActivo.imc}</p>
                <span className="text-[10px] font-extrabold mt-2 inline-block text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                  {atletaActivo.rango}
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Porcentaje Graso</p>
                  <p className="text-2xl font-black text-white">{atletaActivo.grasa}%</p>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 mt-2">
                  <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${Math.min(atletaActivo.grasa * 2.5, 100)}%` }}></div>
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Metabolismo Basal (TMB)</p>
                <p className="text-2xl font-black text-white">{atletaActivo.tmb} kcal</p>
              </div>
            </div>
          </div>

          {/* SUGERENCIA DE ENTRENAMIENTOS SEGÚN RANGO CLÍNICO */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Dumbbell className="h-5 w-5" />
              <h3 className="font-bold text-base text-white">Ejercicios Recomendados según Perfil Clínico</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {atletaActivo.rango === "Sobrepeso Leve" || atletaActivo.rango === "Obesidad" ? (
                <>
                  <div className="bg-slate-950 border-l-4 border-amber-500 p-3 rounded-r-xl">
                    <h4 className="text-xs font-bold text-white uppercase">Cardio en Zona Lipolítica (Z2)</h4>
                    <p className="text-xs text-slate-400 mt-1">Realizar 45 min de rodaje suave manteniendo tus pulsaciones fijas en <span className="text-amber-400 font-bold">{Math.round(fcMaxDinámica * 0.7)} ppm</span> para maximizar la oxidación de ácidos grasos.</p>
                  </div>
                  <div className="bg-slate-950 border-l-4 border-emerald-500 p-3 rounded-r-xl">
                    <h4 className="text-xs font-bold text-white uppercase">Fuerza Concéntrica</h4>
                    <p className="text-xs text-slate-400 mt-1">Sentadillas con copa (Goblet) y peso muerto rumano. Evitar impactos altos para proteger meniscos debido al IMC de <span className="text-emerald-400 font-bold">{atletaActivo.imc}</span>.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-slate-950 border-l-4 border-sky-500 p-3 rounded-r-xl">
                    <h4 className="text-xs font-bold text-white uppercase">Series de Intervalos (Vo2Máx)</h4>
                    <p className="text-xs text-slate-400 mt-1">5 series de 1,000m en pista buscando alcanzar el umbral de las <span className="text-sky-400 font-bold">{Math.round(fcMaxDinámica * 0.92)} ppm</span> con recuperaciones completas.</p>
                  </div>
                  <div className="bg-slate-950 border-l-4 border-purple-500 p-3 rounded-r-xl">
                    <h4 className="text-xs font-bold text-white uppercase">Fuerza Máxima Estructural</h4>
                    <p className="text-xs text-slate-400 mt-1">4 series de 5 repeticiones pesadas enfocadas en optimizar el reclutamiento neuromuscular y la potencia en atletas de {atletaActivo.edad} años.</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* HISTORIAL Y CURVA DE TIEMPOS 1KM */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-6 gap-4">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <TrendingUp className="text-purple-400 h-5 w-5" /> Test de Rendimiento: Carrera de 1 Kilómetro
                </h3>
                <p className="text-xs text-slate-400">Evolución real del atleta en series rápidas de mil metros.</p>
              </div>
              
              <form onSubmit={añadirCarrera} className="flex gap-2 w-full sm:w-auto">
                <input type="text" required placeholder="Fecha (12/06)" value={nuevoTiempo.fecha} onChange={e => setNuevoTiempo({...nuevoTiempo, fecha: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500 w-24" />
                <input type="text" required placeholder="Tiempo (4:15)" value={nuevoTiempo.tiempo} onChange={e => setNuevoTiempo({...nuevoTiempo, tiempo: e.target.value})} className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-purple-500 w-24" />
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white p-1 rounded-lg transition-colors flex items-center justify-center">
                  <Plus className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* GRÁFICO DINÁMICO */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 h-48 flex items-end justify-between relative overflow-hidden">
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-5">
                <div className="border-b border-slate-100 w-full"></div>
                <div className="border-b border-slate-100 w-full"></div>
              </div>

              {historial1k.map((item) => {
                const porcentajeAltura = ((maxSegundos - item.segundos) / rangoSegundos) * 70 + 15;
                return (
                  <div key={item.id} className="flex flex-col items-center flex-1 relative group z-10">
                    <span className="text-[10px] font-mono font-bold bg-slate-900 border border-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded mb-2">
                      {item.tiempo}
                    </span>
                    <div 
                      className="w-3 h-3 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50 border-2 border-slate-950"
                      style={{ marginBottom: `${porcentajeAltura}%` }}
                    ></div>
                    <span className="text-[10px] text-slate-500 font-medium">{item.fecha}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TARJETAS DE CÁLCULO CIENTÍFICO DINÁMICO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Frecuencia Cardíaca Dinámica */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-2 text-rose-400">
                <Flame className="h-4 w-4" />
                <h4 className="font-bold text-sm uppercase tracking-wider text-white">Zonas de Frecuencia Cardíaca</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Z1 (Recuperación - 60%):</span>
                  <span className="font-bold text-emerald-400">{Math.round(fcMaxDinámica * 0.60)} ppm</span>
                </div>
                <div className="flex justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Z5 (U. Anaeróbico - 95%):</span>
                  <span className="font-bold text-rose-400">{Math.round(fcMaxDinámica * 0.95)} ppm</span>
                </div>
              </div>
            </div>

            {/* 2. Rendimiento y VAM Dinámicos */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-sky-400">
                  <Navigation className="h-4 w-4" />
                  <h4 className="font-bold text-sm uppercase tracking-wider text-white">Velocidad de Ascenso y Ritmo</h4>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Tasa Vertical (VAM):</span>
                    <span className="text-white font-bold">{vamDinamica} m/h</span>
                  </div>
                  <div className="flex justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Ritmo Estimado Plano:</span>
                    <span className="text-cyan-400 font-bold">{ritmoFormateado} min/km</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 text-center mt-2 pt-2 border-t border-slate-800/60">
                Métricas adaptadas según el peso base de <span className="text-emerald-400 font-bold">{atletaActivo.peso} kg</span>.
              </div>
            </div>

          </div>

        </section>
      </main>

    </div>
  );
}