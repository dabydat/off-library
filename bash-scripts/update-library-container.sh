#!/bin/bash

echo "=== 🔄 Actualizando el servicio library ==="

echo -e "⏹️  Deteniendo el servicio library..."
docker-compose -f ../docker/docker-compose.dev.yml stop library

echo -e "\n🏗️  Reconstruyendo la imagen..."
docker-compose -f ../docker/docker-compose.dev.yml build library

echo -e "\n▶️  Iniciando el servicio actualizado..."
docker-compose -f ../docker/docker-compose.dev.yml up -d library

echo -e "\n📊 Estado del servicio:"
docker-compose -f ../docker/docker-compose.dev.yml ps library

echo -e "\n🔍 Verificando la base de datos SQLite:"
bash ./sqlite-docker.healthcheck.sh

echo -e "\n✅ Actualización completada"