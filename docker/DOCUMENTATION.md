# Off-Library Microservices - Docker Compose Guía Rápida

Esta guía te ayuda a entender los puntos clave y opciones menos comunes de la configuración Docker Compose para desarrollo y producción.

---

## 🛠️ Desarrollo (`docker-compose.dev.yml`)

- **Hot Reload:**  
  Usa `nodemon` y monta los volúmenes del código fuente para reinicio automático al guardar cambios.
  - Variables especiales:
    - `CHOKIDAR_USEPOLLING=true`
    - `WATCHPACK_POLLING=true`
    - Permiten que el hot-reload funcione bien en Windows + Docker Desktop + WSL.

- **stop_grace_period:**  
  Da tiempo extra para que los servicios cierren correctamente antes de detener el contenedor.

- **depends_on + condition:**  
  Ejemplo:
  ```yaml
  depends_on:
    kafka:
      condition: service_healthy
  ```
  Espera a que Kafka esté listo antes de iniciar los microservicios.

- **sqliteweb:**  
  Permite ver la base de datos SQLite desde el navegador en el puerto `8080`.

---

## ⚙️ Producción (`docker-compose.yml`)

- **Sin hot-reload ni volúmenes de código fuente.**
- **Usa solo el código compilado y la etapa de producción del Dockerfile.**
- **Variables de entorno:**  
  Usa `NODE_ENV=production` y archivos `.env` para configuración sensible.

---

## 💡 Tips Profesionales

- Usa `stop_grace_period` para evitar errores de puerto ocupado.
- Las variables `CHOKIDAR_USEPOLLING` y `WATCHPACK_POLLING` son clave para hot-reload en Windows.
- El healthcheck y `depends_on` aseguran que los servicios arranquen en el orden correcto.

---

**¡Con esta configuración tendrás un entorno de desarrollo ágil y una producción estable!**