# Documentación de Creación del Proyecto NestJS: Off-Library 

Esta guía describe los pasos para crear el proyecto **off-library** con la estructura y dependencias actuales.

## 1. Crear el proyecto base

```bash
nest new off-library
```

## 2. Ingresar al directorio del proyecto

```bash
cd off-library
```

## 3. Instalar dependencias necesarias

```bash
npm install --save @nestjs/microservices @nestjs/config @nestjs/swagger class-validator class-transformer
npm install joi @types/joi
```

## 4. Crear aplicaciones dentro del monorepo

```bash
nest generate app gateway
nest generate app library
```

Esto creará las carpetas `apps/gateway` y `apps/library` dentro del proyecto.

---

## 5. Configurar el Gateway

El siguiente paso es configurar la aplicación **gateway** para trabajar con microservicios y gestión de configuración.

- Se utiliza `@nestjs/config` para la gestión de variables de entorno y validación con Joi.
- El archivo principal de configuración se encuentra en `apps/gateway/src/config/`.
- El módulo principal (`gateway.module.ts`) importa la configuración global y la validación del entorno.
- El gateway está preparado para integrarse con otros microservicios, como el microservicio `library`.

Asegúrate de definir las variables de entorno necesarias en el archivo `.env` dentro de `apps/gateway/`.

---

## 6. Configuración en `main.ts` del Gateway

El archivo `main.ts` es el punto de entrada de la aplicación **gateway**. Aquí se realiza la configuración principal para el arranque del microservicio y la documentación Swagger:

- **Creación de la aplicación:** Se instancia la aplicación usando `NestFactory` con soporte para Express.
- **Carga de configuración:** Se obtiene el servicio de configuración (`ConfigService`) para acceder a variables de entorno como el puerto, la URL del servidor y el entorno de ejecución.
- **CORS:** Se habilita CORS para permitir peticiones desde otros orígenes.
- **Swagger:** Se configura la documentación interactiva de la API usando Swagger. Se genera el archivo `swagger-spec.json` y, si no estamos en producción, se habilita la ruta `/swagger` para consultar la documentación.
- **Validación global:** Se aplica un `ValidationPipe` global para validar y transformar automáticamente los datos recibidos en las peticiones.
- **Arranque del servidor:** Se inicia la aplicación en el puerto definido en las variables de entorno y se muestra un log indicando el puerto en uso.

Esta configuración prepara el gateway para funcionar como Backend for Frontend (BFF), integrando microservicios y ofreciendo documentación automática de la API.

## 7. Configuración de la aplicación `library`

La aplicación **library** está diseñada como un microservicio independiente dentro del monorepo. Su configuración se basa en el uso de variables de entorno, validación de configuración y la integración con una base de datos mediante TypeORM.

### Estructura de configuración

- **Gestión de configuración:**  
  Se utiliza `@nestjs/config` para cargar y validar variables de entorno.  
  El archivo principal de configuración se encuentra en `apps/library/src/config/`.

- **Validación de variables de entorno:**  
  El archivo `config-validation.ts` define el esquema de validación usando Joi, asegurando que todas las variables necesarias estén presentes y sean del tipo correcto.

- **Definición de tipos:**  
  El archivo `config.type.ts` define los tipos de datos esperados para la configuración, incluyendo los tipos de base de datos soportados y la estructura de la configuración.

- **Carga y transformación de configuración:**  
  El archivo `index.ts` procesa las variables de entorno, valida y transforma los valores para que estén disponibles en toda la aplicación.

### Integración con la base de datos

- **Instalación de dependencias adicionales:**
  Para soporte de base de datos y patrones avanzados, ejecuta:

  ```bash
  npm install @nestjs/typeorm typeorm
  npm install typeorm-naming-strategies
  npm install @nestjs/cqrs
  ```

- **Módulo de base de datos:**  
  El módulo `DatabaseModule` (en `config/database/database.module.ts`) utiliza `@nestjs/typeorm` para conectar la aplicación a la base de datos, leyendo los parámetros desde la configuración cargada.

- **Estrategia de nombres:**  
  Se utiliza una estrategia personalizada (`UppercaseSnakeNamingStrategy`) para que los nombres de tablas y columnas en la base de datos sigan el formato SNAKE_UPPERCASE.

- **DataSource:**  
  El archivo `data-source.ts` define la configuración de TypeORM para migraciones y entidades, usando las variables de entorno.

### Arranque del microservicio

- El archivo `main.ts` crea la aplicación y la expone como un microservicio TCP, utilizando los valores de host y puerto definidos en la configuración.
- Se aplica un `ValidationPipe` global para validar y transformar los datos recibidos.
- El microservicio queda listo para recibir conexiones y procesar mensajes.

---

## Diferencias entre Gateway y Library

- **Gateway:**  
  - Funciona como Backend for Frontend (BFF), es decir, es el punto de entrada para el frontend.
  - Expone endpoints HTTP y genera documentación Swagger.
  - Integra y orquesta la comunicación con los microservicios internos (como library).
  - Usa Express como plataforma subyacente.

- **Library:**  
  - Es un microservicio puro, pensado para ser consumido por el gateway u otros servicios.
  - No expone endpoints HTTP directamente, sino que se comunica usando transporte TCP (u otros soportados por NestJS).
  - Incluye integración con base de datos y lógica de dominio específica.
  - Su configuración y arranque están orientados a la arquitectura de microservicios.

---

Esta separación permite escalar y mantener cada parte de la aplicación de forma independiente, siguiendo buenas prácticas de arquitectura basada en microservicios.

## 8. Creación de librería compartida

Para compartir código entre microservicios, crea una librería:

```bash
nest g library common-core
```

Esto genera la carpeta `libs/common-core` donde puedes colocar utilidades, constantes, decoradores y tipos compartidos.

---

## 9. Estructura basada en CQRS, DDD y Hexagonal

Se organizaron las carpetas de cada módulo siguiendo los principios de:

- **CQRS (Command Query Responsibility Segregation):** Separando comandos, queries y event handlers.
- **DDD (Domain-Driven Design):** Separando dominio, infraestructura y aplicación.
- **Hexagonal Architecture:** Separando adaptadores (por ejemplo, controladores REST, TCP) y puertos.

Ejemplo de estructura para el módulo `book`:

```
src/book/
  ├── application/
  │     ├── commands/
  │     ├── queries/
  │     │     └── get-books/
  │     │           ├── get-books.handler.ts
  │     │           └── get-books.query.ts
  │     └── event-handlers/
  ├── domain/
  │     ├── events/
  │     ├── models/
  │     ├── ports/
  │     ├── repositories/
  │     ├── value-objects/
  │     ├── validators/
  │     └── exceptions/
  ├── infrastructure/
  │     ├── persistence/
  │     │     ├── entities/
  │     │     ├── migrations/
  │     │     └── repositories/
  │     ├── i18n/
  │     ├── mappers/
  │     ├── queue/
  │     ├── adapters/
  │     └── tcp/
  │           └── book.controller.ts
  └── book.module.ts
```

---

## 10. Comandos para migraciones (Windows y Linux)

Se agregaron scripts en `package.json` para crear y ejecutar migraciones de TypeORM en ambos sistemas operativos:

```json
"windows:migration:create": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create ./apps/%npm_config_api%/src/%npm_config_module%/infrastructure/persistence/migrations/%npm_config_name%",
"windows:migration:run": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./apps/%npm_config_api%/src/config/database/data-source.ts",
"windows:migration:rollback": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d ./apps/%npm_config_api%/src/config/database/data-source.ts",
"migration:create": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create ./apps/$npm_config_api/src/$npm_config_module/infrastructure/persistence/migrations/$npm_config_name",
"migration:run": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./apps/$npm_config_api/src/config/database/data-source.ts",
"migration:rollback": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d ./apps/$npm_config_api/src/config/database/data-source.ts"
```

- Usa los scripts con variables de entorno para especificar la app y módulo:
  - **Windows:** Usa `%npm_config_api%` y `%npm_config_module%`
  - **Linux/Mac:** Usa `$npm_config_api` y `$npm_config_module`

**Ejemplo de uso:**

```bash
npm run migration:create --npm_config_api=library --npm_config_module=book --npm_config_name=CreateBooksTable
npm run migration:run --npm_config_api=library
npm run migration:rollback --npm_config_api=library
```

---

## 11. Resumen de la arquitectura

- **CQRS:** Comandos y queries separados para claridad y escalabilidad.
- **DDD:** Separación clara de dominio, infraestructura y aplicación.
- **Hexagonal:** Adaptadores para REST, TCP, colas, etc.
- **Librería compartida:** Código reutilizable en `libs/common-core`.
- **Migraciones multiplataforma:** Scripts para Windows y Linux.

---

## 12. Librería Compartida: `common-core`

La librería `common-core` se creó para centralizar y reutilizar código, tipos, constantes y utilidades entre los distintos microservicios del monorepo. Esto permite mantener la coherencia y evitar duplicidad de lógica o definiciones.

### Estructura y propósito de los archivos principales

#### `src/infrastructure/`

- **constants/client.constants.ts**  
  Define símbolos únicos para identificar clientes de microservicios, por ejemplo:
  ```ts
  export const ClientConstant = {
      LIBRARY_CLIENT: Symbol('LIBRARY_CLIENT'),
  };
  ```
  Se usa para inyectar y referenciar el cliente TCP del microservicio `library` en el gateway.

- **decorators/api-ok-response-paginated.decorator.ts**  
  Aquí puedes definir un decorador personalizado para documentar respuestas paginadas en Swagger, facilitando la reutilización y estandarización de la documentación de endpoints.

- **rest/error.response.ts**  
  Define la estructura estándar para respuestas de error en la API, incluyendo detalles como mensaje, código y parámetros inválidos.  
  Esto ayuda a mantener un formato uniforme de errores en todos los servicios.

- **rest/rest-data.response.ts**  
  Clase genérica para respuestas exitosas que contienen datos.  
  ```ts
  export class RestDataResponse<T> {
      @ApiProperty({ description: 'Payload of the response with the requested data\n' })
      public data: T;
  }
  ```
  Permite estandarizar la forma en que se devuelven los datos en los endpoints.

- **rest/rest-pagination.response.ts**  
  Clase para respuestas paginadas, útil para endpoints que devuelven listas de elementos con paginación.

#### `src/domain/`

- **constants/library.constant.ts**  
  Define rutas, nombres de controladores y patrones de mensajes relacionados con el microservicio `library`.  
  Ejemplo:  
  ```ts
  export const LibraryControllerMap = {
      GET_BOOKS: {
          ROUTE: '',
          MESSAGE_PATTERN: LibraryMessagePatterns.GET_BOOKS,
      },
  };
  ```
  Esto permite que tanto el gateway como el microservicio usen los mismos identificadores para comunicarse.

- **enums/library-message-patterns.enum.ts**  
  Enumera los patrones de mensajes (por ejemplo, `GET_BOOKS`) que se usan para la comunicación entre el gateway y el microservicio `library` mediante TCP.

- **types/controller-action.type.ts**  
  Define el tipo `ControllerAction`, que asocia rutas HTTP con patrones de mensajes para facilitar la integración entre REST y microservicios.

---

### ¿Cómo se relaciona `common-core` con `library` y `gateway`?

- **En el microservicio `library`:**
  - Usa los enums y constantes de `common-core` para definir y manejar los patrones de mensajes TCP.
  - Por ejemplo, el controlador TCP de `library` escucha el patrón `LibraryMessagePatterns.GET_BOOKS` para responder a solicitudes de libros.

- **En el gateway:**
  - Utiliza los mismos patrones y constantes para enviar mensajes al microservicio `library` a través del cliente TCP.
  - Los tipos y decoradores de respuesta (`RestDataResponse`, `RestPaginationResponse`, etc.) se usan para estandarizar las respuestas de los endpoints REST del gateway.

- **Ventajas:**
  - **Desacoplamiento:** Los contratos de comunicación y tipos de datos están centralizados, evitando inconsistencias.
  - **Reutilización:** Decoradores, respuestas y constantes se usan en ambos servicios sin duplicar código.
  - **Escalabilidad:** Si se agregan nuevos microservicios, pueden reutilizar la misma librería para integrarse fácilmente.

---

### Ejemplo de flujo de comunicación

1. **Gateway** recibe una petición HTTP para obtener libros.
2. Usa el cliente TCP (`LIBRARY_CLIENT`) y el patrón de mensaje (`GET_BOOKS`) definidos en `common-core` para enviar la solicitud al microservicio `library`.
3. **Library** responde usando el mismo patrón, devolviendo los datos en el formato definido por las clases de respuesta de `common-core`.
4. **Gateway** transforma la respuesta y la entrega al cliente HTTP, usando los decoradores y clases de respuesta de `common-core` para mantener la consistencia.

---

Con esta integración, la librería `common-core` se convierte en el contrato y la base común para la colaboración entre todos los microservicios del monorepo.

Cabe destacar que con esta estructura y configuración, el proyecto está preparado para escalar, mantener y evolucionar siguiendo buenas prácticas de arquitectura de software moderna.

## 13. Integración de Kafka y Manejo de Excepciones Personalizadas

### Instalación de dependencias para mensajería y logging

Para habilitar la mensajería con Kafka y el logging avanzado con Winston, ejecuta:

```bash
npm install kafkajs winston nest-winston
npm install --save-dev @types/kafkajs @types/winston
```

---

### Servicio de Kafka

Se implementó un servicio `KafkaService` en `apps/library/src/book/infrastructure/queue/kafka.service.ts` que cumple con la interfaz `QueueService` definida en la librería `common-core`. Este servicio permite publicar y consumir mensajes en Kafka, integrando la lógica de reintentos y el manejo de logs con Winston.

**Propósito y uso:**
- **Publicar mensajes:** Permite enviar eventos o comandos a otros servicios o sistemas externos.
- **Consumir mensajes:** Permite reaccionar a eventos publicados en Kafka, procesando mensajes de forma asíncrona y tolerante a fallos.
- **Logging:** Utiliza Winston para registrar eventos importantes y errores.

**Inyección y uso:**
- El servicio se provee usando el token `QUEUE_SERVICE` definido en `libs/common-core/src/domain/services/queue.service.ts`.
- Se inyecta en los módulos que requieren interacción con Kafka, como el módulo de libros (`BookModule`).

---

### Excepciones Personalizadas

Se agregaron excepciones personalizadas en `libs/common-core/src/domain/exceptions/` para un manejo de errores más robusto y estandarizado entre microservicios:

- **tcp.exception.ts:**  
  Define la excepción base `TcpException` para errores en la comunicación entre microservicios (por ejemplo, vía TCP). Permite incluir detalles adicionales como código de error y parámetros relacionados.

- **domain.exception.ts:**  
  Excepción abstracta para errores de dominio, extiende `TcpException` y permite agregar argumentos personalizados y claves de error.

- **value-object.exception.ts:**  
  Excepción específica para errores relacionados con Value Objects en DDD, hereda de `DomainException`.

**Ventajas:**
- Permiten propagar errores con información estructurada entre microservicios.
- Facilitan el manejo centralizado de errores y la generación de respuestas uniformes hacia el frontend o consumidores de la API.

---

### Relación con la arquitectura y otros módulos

- **KafkaService** se utiliza como una implementación concreta de la interfaz `QueueService`, lo que permite desacoplar la lógica de mensajería del framework o broker específico.
- **Las excepciones personalizadas** se usan tanto en el microservicio `library` como en el gateway para garantizar que los errores se manejen y comuniquen de forma consistente.
- **Winston y nest-winston** permiten centralizar y mejorar el logging, facilitando la trazabilidad y el monitoreo de eventos y errores en producción.

---

### Resumen de la integración

- **Kafka:** Permite la comunicación asíncrona y desacoplada entre microservicios o con sistemas externos.
- **Winston:** Proporciona un sistema de logging robusto y flexible.
- **Excepciones personalizadas:** Estandarizan el manejo de errores y mejoran la interoperabilidad entre servicios.
- **Inyección de dependencias:** Todo está centralizado y desacoplado usando tokens y contratos definidos en `common-core`.

Con estas integraciones, el proyecto está preparado para escalar en entornos distribuidos, soportar eventos y comandos asíncronos, y mantener un manejo de errores y logs profesional y consistente.

---

## Conclusión

Con esta guía, tienes toda la información necesaria para crear, configurar y escalar el proyecto Off-Library siguiendo las mejores prácticas de arquitectura moderna. La documentación cubre desde la instalación inicial hasta la integración avanzada de microservicios, mensajería y manejo de errores, asegurando un desarrollo profesional y sostenible.