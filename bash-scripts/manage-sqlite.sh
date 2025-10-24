#!/bin/bash

function show_help {
  echo "=== 🗃️ Gestión de SQLite ==="
  echo "Uso: ./manage-sqlite.sh [comando]"
  echo ""
  echo "Comandos disponibles:"
  echo "  check    - Verifica el estado de la base de datos"
  echo "  fix      - Corrige la ubicación de la base de datos"
  echo "  init     - Inicializa la base de datos con tablas"
  echo "  backup   - Crea una copia de seguridad"
  echo "  restore  - Restaura una copia de seguridad"
  echo ""
  echo "Ejemplos:"
  echo "  ./manage-sqlite.sh check"
  echo "  ./manage-sqlite.sh backup"
}

case "$1" in
  check)
    ./check-sqlite-health.sh
    ;;
  fix)
    ./fix-sqlite-location.sh
    ;;
  init)
    ./init-database.sh
    ;;
  backup)
    echo "=== 💾 Creando copia de seguridad ==="
    BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).db"
    docker exec library mkdir -p /app/backups
    docker exec library bash -c "if [ -f /app/data/off_library.db ]; then cp /app/data/off_library.db /app/backups/$BACKUP_FILE && echo \"✅ Backup creado: $BACKUP_FILE\"; else echo \"❌ Base de datos no encontrada\"; fi"
    docker exec library ls -la /app/backups
    ;;
  restore)
    echo "=== 🔄 Restaurando copia de seguridad ==="
    if [ -z "$2" ]; then
      echo "❌ Debes especificar un archivo de backup"
      echo "Backups disponibles:"
      docker exec library ls -la /app/backups
      echo "Ejemplo: ./manage-sqlite.sh restore backup-20251020-123456.db"
      exit 1
    fi
    docker exec library bash -c "if [ -f /app/backups/$2 ]; then cp /app/backups/$2 /app/data/off_library.db && chmod 666 /app/data/off_library.db && echo \"✅ Backup restaurado: $2\"; else echo \"❌ Backup no encontrado\"; fi"
    docker-compose -f ../docker/docker-compose.dev.yml restart sqliteweb
    ;;
  *)
    show_help
    ;;
esac