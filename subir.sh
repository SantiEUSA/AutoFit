#!/bin/bash
echo "=========================================="
echo "🚀 INICIANDO ACTUALIZACIÓN TOTAL DE AUTOFIT"
echo "=========================================="

# 1. Moverse a la raíz por si acaso
cd "$(dirname "$0")"

# 2. Añadir absolutamente todos los cambios del proyecto
echo "📦 Empaquetando archivos modificados..."
git add .

# 3. Crear el mensaje de guardado con la fecha actual
fecha=$(date +"%Y-%m-%d %H:%M")
git commit -m "update: actualización automática del ecosistema - $fecha"

# 4. Subir directo a GitHub
echo "⚡ Subiendo cambios a GitHub (Repo Remoto)..."
git push origin main

echo "=========================================="
echo "✅ ¡PROYECTO ACTUALIZADO CON ÉXITO EN GITHUB!"
echo "=========================================="