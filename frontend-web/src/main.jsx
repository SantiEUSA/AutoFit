import React from 'react'
import ReactDOM from 'react-dom/client'
import Dashboard from './pages/Dashboard.jsx'
import './index.css' // Importa los estilos globales de Tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>,
)