#!/bin/bash

echo "=== 🔄 Reiniciando contenedores Docker ==="

if [ "$1" == "" ]; then
    echo -e "🔄 Reiniciando todos los contenedores...\n"
    docker-compose -f ../docker/docker-compose.dev.yml restart
else
    echo -e "🔄 Reiniciando el servicio $1...\n"
    docker-compose -f ../docker/docker-compose.dev.yml restart $1
fi

echo -e "\n📊 Estado de los contenedores:"
docker-compose -f ../docker/docker-compose.dev.yml ps

echo -e "\n✅ Reinicio completado"