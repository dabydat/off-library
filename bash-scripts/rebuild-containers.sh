#!/bin/bash

echo "=== 🔄 Reconstrucción completa del entorno Docker ==="
echo "⚠️  ADVERTENCIA: Este proceso eliminará todos los contenedores, imágenes y volúmenes"
read -p "¿Estás seguro de continuar? (s/n): " confirmation

if [ "$confirmation" != "s" ]; then
    echo "❌ Operación cancelada"
    exit 1
fi

echo -e "\n🔽 Deteniendo contenedores existentes..."
docker-compose -f ../docker/docker-compose.dev.yml down

echo -e "\n🗑️  Eliminando contenedores, redes e imágenes..."
docker-compose -f ../docker/docker-compose.dev.yml down -v --rmi all

echo -e "\n🧹 Limpiando recursos no utilizados..."
docker system prune -af
docker volume prune -f

echo -e "\n🏗️  Reconstruyendo imágenes sin caché..."
docker-compose -f ../docker/docker-compose.dev.yml build --no-cache

echo -e "\n▶️  Iniciando contenedores..."
docker-compose -f ../docker/docker-compose.dev.yml up -d

echo -e "\n📊 Estado de los contenedores:"
docker-compose -f ../docker/docker-compose.dev.yml ps

echo -e "\n⏳ Esperando 10 segundos para que los servicios se inicialicen..."
sleep 10

echo -e "\n🔍 Verificando la configuración de SQLite:"
./check-sqlite-health.sh

echo -e "\n✅ Reconstrucción completa finalizada"
echo "🌐 Accede a SQLiteWeb en: http://localhost:8080"
echo "🔌 API Gateway en: http://localhost:8000"
echo "📚 Servicio Library en: http://localhost:8001"
echo "🔧 Portainer en: http://localhost:9000"
echo -e "\n⚠️  Si SQLiteWeb muestra errores, ejecuta: ./fix-sqlite-location.sh y luego ./init-database.sh"