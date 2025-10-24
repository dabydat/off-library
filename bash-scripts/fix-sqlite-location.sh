#!/bin/bash

echo "=== 🛠️ Corrigiendo ubicación de la base de datos SQLite ==="

# Verificar dónde está la base de datos
echo -e "🔍 Buscando archivos de base de datos..."
DB_FILES=$(docker exec library find /app -name "off_library.db" 2>/dev/null)
echo "$DB_FILES"

# Si la base de datos existe en la raíz, moverla al directorio correcto
if docker exec library test -f /app/off_library.db; then
  echo -e "\n📦 Moviendo base de datos a la ubicación correcta..."
  # Asegurar que existe el directorio
  docker exec library mkdir -p /app/data
  # Mover el archivo
  docker exec library mv /app/off_library.db /app/data/off_library.db
  echo "✅ Base de datos movida correctamente"
fi

# Si la base de datos no existe en ninguna parte, crearla
if ! docker exec library test -f /app/data/off_library.db; then
  echo -e "\n🏗️ Creando base de datos en la ubicación correcta..."
  docker exec library mkdir -p /app/data
  docker exec library touch /app/data/off_library.db
  echo "✅ Archivo de base de datos creado"
fi

# Asignar permisos correctos
echo -e "\n🔒 Ajustando permisos..."
docker exec library chmod 666 /app/data/off_library.db
docker exec library ls -la /app/data/off_library.db

# Reiniciar SQLiteWeb
echo -e "\n🔄 Reiniciando SQLiteWeb..."
docker-compose -f ../docker/docker-compose.dev.yml restart sqliteweb

echo -e "\n✅ La ubicación de la base de datos ha sido corregida"
echo "ℹ️  Para inicializar la base de datos con tablas, ejecuta: ./init-database.sh"