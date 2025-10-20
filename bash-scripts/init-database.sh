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

# Crear tablas iniciales
echo -e "\n🏗️ Creando tablas iniciales..."
docker exec -i library bash -c "cat > /tmp/init.sql << 'EOF'
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'reader',
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT UNIQUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Añadir dato de prueba
INSERT OR IGNORE INTO books (id, title, author, isbn) 
VALUES ('test-1', 'Ejemplo de Libro', 'Autor de Prueba', '1234567890123');
EOF"

docker exec -i library bash -c "sqlite3 /app/data/off_library.db < /tmp/init.sql"

# Listar tablas creadas
echo -e "\n📋 Listando tablas creadas:"
docker exec library sqlite3 /app/data/off_library.db ".tables"

# Ver muestra de datos
echo -e "\n📊 Muestra de datos:"
docker exec library sqlite3 /app/data/off_library.db "SELECT * FROM books;"

# Reiniciar sqliteweb para reflejar los cambios
echo -e "\n🔄 Reiniciando sqliteweb para reflejar los cambios..."
docker-compose -f ../docker/docker-compose.dev.yml restart sqliteweb

echo -e "\n✅ Base de datos inicializada correctamente"
echo "🌐 Accede a SQLiteWeb en: http://localhost:8080"