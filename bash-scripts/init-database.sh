#!/bin/bash

echo "=== 🗃️ Inicializando base de datos SQLite ==="

# Verificar si existe la base de datos, si no, corregir la ubicación
if ! docker exec library test -f /app/data/off_library.db; then
  echo -e "⚠️ Base de datos no encontrada, ejecutando corrección de ubicación..."
  ./fix-sqlite-location.sh
fi

# Verificar si sqlite3 está instalado
echo -e "\n🔍 Verificando si sqlite3 está instalado en el contenedor..."
docker exec library which sqlite3 > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo -e "⬇️ Instalando sqlite3..."
  docker exec library apt-get update && docker exec library apt-get install -y sqlite3
else
  echo "✅ sqlite3 ya está instalado"
fi

# Listar tablas creadas
echo -e "\n📋 Listando tablas creadas:"
docker exec library sqlite3 /app/data/off_library.db ".tables"

# Reiniciar sqliteweb para reflejar los cambios
echo -e "\n🔄 Reiniciando sqliteweb para reflejar los cambios..."
docker-compose -f ../docker/docker-compose.dev.yml restart sqliteweb

echo -e "\n✅ Base de datos inicializada correctamente"
echo "🌐 Accede a SQLiteWeb en: http://localhost:8080"