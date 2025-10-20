#!/bin/bash

if [ "$1" == "" ]; then
    echo "⚠️  Debes especificar el nombre del servicio"
    echo "📋 Servicios disponibles:"
    docker-compose -f ../docker/docker-compose.dev.yml ps --services
    echo -e "\n📌 Ejemplo de uso: ./docker-logs.sh library"
    exit 1
fi

echo "=== 📃 Mostrando logs del servicio $1 ==="
echo -e "📌 Presiona Ctrl+C para salir\n"

docker-compose -f ../docker/docker-compose.dev.yml logs -f $1