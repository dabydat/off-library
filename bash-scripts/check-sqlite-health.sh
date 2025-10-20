#!/bin/bash

echo "=== 🔍 Verificando estado de SQLite ==="

# Verificar que los contenedores están funcionando
echo -e "\n📊 Estado de contenedores:"
docker-compose -f ../docker/docker-compose.dev.yml ps

# Verificar que los volúmenes se han creado correctamente
echo -e "\n💾 Verificando volúmenes:"
docker volume ls | grep sqlite

# Verificar que los directorios existen dentro del contenedor
echo -e "\n📁 Verificando directorios en el contenedor library:"
docker exec library ls -la /app/data
docker exec library ls -la /app/backups

# Verificar que existe el archivo de base de datos y su tamaño
echo -e "\n🗃️ Verificando archivo de base de datos:"
docker exec library ls -la /app/data/off_library.db 2>/dev/null || echo "❌ Base de datos no encontrada en /app/data/off_library.db"
docker exec library ls -la /app/off_library.db 2>/dev/null && echo "⚠️ Base de datos encontrada en ubicación incorrecta: /app/off_library.db"

# Verificar tamaño de la base de datos
docker exec library du -h /app/data/off_library.db 2>/dev/null || echo "❌ No se pudo verificar el tamaño"

# Verificar la estructura de la base de datos
echo -e "\n📋 Tablas en la base de datos:"
docker exec library bash -c "if command -v sqlite3 &> /dev/null; then sqlite3 /app/data/off_library.db '.tables' 2>/dev/null || echo '❌ No hay tablas o la base de datos está vacía'; else echo '⚠️ sqlite3 no está instalado'; fi"

# Sugerir acciones si hay problemas
if ! docker exec library test -f /app/data/off_library.db; then
  echo -e "\n⚠️ ACCIÓN RECOMENDADA: Ejecuta ./fix-sqlite-location.sh para corregir problemas de ubicación"
  echo -e "⚠️ ACCIÓN RECOMENDADA: Ejecuta ./init-database.sh para inicializar la base de datos"
fi

echo -e "\n✅ Verificación completada"