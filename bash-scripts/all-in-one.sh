#!/bin/bash

echo "=== 🚀 Configuración completa de Off-Library ==="

# Hacer ejecutables todos los scripts
chmod +x check-sqlite-health.sh fix-sqlite-location.sh init-database.sh manage-sqlite.sh \
       rebuild-containers.sh restart-containers.sh update-library-container.sh watch-logs.sh

# Reconstruir todo el entorno Docker
./rebuild-containers.sh

# Corregir ubicación de la base de datos
./fix-sqlite-location.sh

# Inicializar la base de datos SQLite
./init-database.sh

echo -e "\n✅ Configuración completa finalizada"
echo "🌐 Accede a SQLiteWeb en: http://localhost:8080"
echo "🔌 API Gateway en: http://localhost:8000"
echo "📚 Servicio Library en: http://localhost:8001"
echo "🔧 Portainer en: http://localhost:9000"