# Exception Handling Guide

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Tipos de Excepciones](#tipos-de-excepciones)
- [Convenciones de Nombres](#convenciones-de-nombres)
- [Mapeo Automático de Status HTTP](#mapeo-automático-de-status-http)
- [Cómo Crear una Nueva Excepción](#cómo-crear-una-nueva-excepción)
- [Estructura de Respuesta](#estructura-de-respuesta)
- [Ejemplos](#ejemplos)
- [Debugging](#debugging)

---

## 📖 Descripción General

El sistema de manejo de excepciones está diseñado siguiendo **principios SOLID** y utiliza el **patrón Strategy** para mapear automáticamente excepciones a respuestas HTTP estandarizadas.

### Características Principales

✅ **Mapeo automático**: Las excepciones se mapean a códigos HTTP según su nombre  
✅ **Sin configuración manual**: No necesitas registrar cada nueva excepción  
✅ **Basado en convenciones**: Sigue las convenciones de nombres y funciona automáticamente  
✅ **Respuestas estandarizadas**: Formato consistente en toda la aplicación  
✅ **Metadata rica**: Incluye información de debugging en desarrollo

---

## 🎯 Tipos de Excepciones

### 1. **DomainException** (Lógica de Negocio)

```typescript
export class BookAlreadyExistsException extends DomainException {
    constructor(message: string, details?: string) {
        super(
            `Book already exists. ${message}`,
            BookAlreadyExistsException.name,
            details
        );
    }
}
```

**Cuándo usar:**
- Reglas de negocio violadas
- Entidades no encontradas
- Conflictos de datos
- Validaciones de dominio

---

### 2. **ValueObjectException** (Validaciones de Valores)

```typescript
export class InvalidISBNException extends ValueObjectException {
    constructor(message: string, details?: string) {
        super(
            `Invalid ISBN. ${message}`,
            InvalidISBNException.name,
            details
        );
    }
}
```

**Cuándo usar:**
- Valores inválidos (email, URL, ISBN, etc.)
- Formatos incorrectos
- Rangos fuera de límite
- Tipos de dato incorrectos

---

### 3. **HttpException** (Validaciones de Request)

```typescript
throw new BadRequestException('Invalid request payload');
throw new UnauthorizedException('Invalid credentials');
throw new NotFoundException('Resource not found');
```

**Cuándo usar:**
- Validaciones de DTOs (class-validator)
- Errores de autenticación
- Errores de autorización
- Validaciones de request HTTP

---

## 📏 Convenciones de Nombres

El sistema **mapea automáticamente** el status HTTP basándose en el nombre de la excepción:

| Patrón en el Nombre | HTTP Status | Ejemplo |
|---------------------|-------------|---------|
| `*AlreadyExists*` | **409 Conflict** | `BookAlreadyExistsException` |
| `*Duplicate*` | **409 Conflict** | `EmailDuplicateException` |
| `*Exists*` | **409 Conflict** | `UserExistsException` |
| `*NotFound*` | **404 Not Found** | `BookNotFoundException` |
| `*Missing*` | **404 Not Found** | `AuthorMissingException` |
| `*DoesNotExist*` | **404 Not Found** | `RecordDoesNotExistException` |
| `*Invalid*` | **400 Bad Request** | `InvalidISBNException` |
| `*Malformed*` | **400 Bad Request** | `MalformedDataException` |
| `Bad*` | **400 Bad Request** | `BadFormatException` |
| `*Unauthorized*` | **401 Unauthorized** | `UnauthorizedAccessException` |
| `*Unauthenticated*` | **401 Unauthorized** | `UnauthenticatedException` |
| `*Forbidden*` | **403 Forbidden** | `ForbiddenOperationException` |
| `*AccessDenied*` | **403 Forbidden** | `AccessDeniedException` |
| `*PermissionDenied*` | **403 Forbidden** | `PermissionDeniedException` |

### ⚙️ Configuración de Reglas

Las reglas se definen en: `libs/common-core/src/infrastructure/filters/solid/exception-mapping.rules.ts`

```typescript
export const EXCEPTION_MAPPING_RULES: ExceptionMappingRule[] = [
    {
        patterns: ['AlreadyExists', 'Duplicate', 'Exists'],
        status: HttpStatus.CONFLICT,
        priority: 10,
    },
    // ... más reglas
];
```

**Para agregar una nueva regla:**

1. Abre `exception-mapping.rules.ts`
2. Agrega un nuevo objeto con:
   - `patterns`: Array de strings que matchean en el nombre
   - `status`: Código HTTP a retornar
   - `priority`: Mayor = se evalúa primero (opcional)

---

## 🆕 Cómo Crear una Nueva Excepción

### Paso 1: Determina el Tipo

- **¿Es lógica de negocio?** → Usa `DomainException`
- **¿Es validación de valor?** → Usa `ValueObjectException`
- **¿Es validación HTTP?** → Usa `HttpException` de NestJS

### Paso 2: Elige un Nombre Descriptivo

Usa las **convenciones de nombres** para obtener el mapeo automático:

```typescript
// ✅ BIEN: Se mapea automáticamente a 409 Conflict
BookAlreadyExistsException

// ✅ BIEN: Se mapea automáticamente a 404 Not Found
AuthorNotFoundException

// ✅ BIEN: Se mapea automáticamente a 400 Bad Request
InvalidEmailException

// ❌ MAL: Nombre genérico, se mapea a 400 por defecto
BookException
```

### Paso 3: Crea la Clase

```typescript
// filepath: apps/library/src/book/domain/exceptions/book-already-exists.exception.ts
import { DomainException } from "@app/common-core/domain/exceptions/domain.exception";

export class BookAlreadyExistsException extends DomainException {
    constructor(message: string, details?: string) {
        super(
            `Book already exists. ${message}`,
            BookAlreadyExistsException.name,
            details
        );
    }
}
```

### Paso 4: Úsala en tu Código

```typescript
// En un Handler o Service
if (await this.bookExists(isbn)) {
    throw new BookAlreadyExistsException(
        `A book with ISBN ${isbn} already exists`
    );
}
```

### Paso 5: ¡Listo! 🎉

No necesitas configurar nada más. El sistema automáticamente:

1. ✅ Captura la excepción
2. ✅ La mapea al status HTTP correcto (409 en este caso)
3. ✅ Genera el código de error: `BOOK_ALREADY_EXISTS_EXCEPTION`
4. ✅ Retorna una respuesta estandarizada

---

## 📦 Estructura de Respuesta

Todas las excepciones retornan el siguiente formato:

```json
{
    "status": "error",
    "timestamp": "2025-10-28T03:52:27.997Z",
    "path": "/library/create-book",
    "method": "PUT",
    "details": [
        {
            "message": "Book already exists. A book with this ISBN: 9780743273565 already exists.",
            "code": "BOOK_ALREADY_EXISTS_EXCEPTION",
            "param": "9780743273565"
        }
    ],
    "meta": {
        "exceptionType": "DomainException",
        "exceptionName": "BookAlreadyExistsException",
        "handler": "RpcGlobalExceptionFilter"
    }
}
```

### Campos

| Campo | Descripción |
|-------|-------------|
| `status` | Siempre `"error"` |
| `timestamp` | Fecha/hora ISO del error |
| `path` | Ruta del endpoint |
| `method` | Método HTTP (GET, POST, PUT, etc.) |
| `details[]` | Array de errores |
| `details[].message` | Mensaje descriptivo |
| `details[].code` | Código de error en SNAKE_CASE |
| `details[].param` | Parámetro relacionado (opcional) |
| `meta.exceptionType` | Tipo base de la excepción |
| `meta.exceptionName` | Nombre específico de la excepción |
| `meta.handler` | Filtro que procesó la excepción |

---

## 📚 Ejemplos Completos

### Ejemplo 1: Entidad Ya Existe (409 Conflict)

```typescript
// Excepción
export class UserAlreadyExistsException extends DomainException {
    constructor(email: string) {
        super(
            `User already exists with email: ${email}`,
            UserAlreadyExistsException.name
        );
    }
}

// Uso
throw new UserAlreadyExistsException('john@example.com');

// Respuesta HTTP 409
{
    "status": "error",
    "details": [{
        "message": "User already exists with email: john@example.com",
        "code": "USER_ALREADY_EXISTS_EXCEPTION"
    }],
    "meta": {
        "exceptionType": "DomainException",
        "exceptionName": "UserAlreadyExistsException"
    }
}
```

### Ejemplo 2: Entidad No Encontrada (404 Not Found)

```typescript
// Excepción
export class BookNotFoundException extends DomainException {
    constructor(bookId: string) {
        super(
            `Book with ID ${bookId} not found`,
            BookNotFoundException.name
        );
    }
}

// Uso
throw new BookNotFoundException('123');

// Respuesta HTTP 404
{
    "status": "error",
    "details": [{
        "message": "Book with ID 123 not found",
        "code": "BOOK_NOT_FOUND_EXCEPTION"
    }]
}
```

### Ejemplo 3: Valor Inválido (400 Bad Request)

```typescript
// Excepción
export class InvalidEmailException extends ValueObjectException {
    constructor(email: string) {
        super(
            `The email "${email}" is not valid`,
            InvalidEmailException.name,
            email
        );
    }
}

// Uso
throw new InvalidEmailException('invalid-email');

// Respuesta HTTP 400
{
    "status": "error",
    "details": [{
        "message": "The email \"invalid-email\" is not valid",
        "code": "INVALID_EMAIL_EXCEPTION",
        "param": "invalid-email"
    }]
}
```

### Ejemplo 4: Validación de DTO (422 Unprocessable Entity)

```typescript
// DTO con class-validator
export class CreateBookDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsISBN()
    isbn: string;
}

// Request inválido automáticamente retorna:
{
    "status": "error",
    "details": [
        {
            "message": "name should not be empty",
            "code": "VALIDATION_ERROR"
        },
        {
            "message": "isbn must be an ISBN",
            "code": "VALIDATION_ERROR"
        }
    ]
}
```

---

## 🐛 Debugging

### Ver Metadata en Respuestas

La metadata está **siempre visible** en el objeto `meta`:

```json
"meta": {
    "exceptionType": "DomainException",
    "exceptionName": "BookAlreadyExistsException",
    "handler": "RpcGlobalExceptionFilter"
}
```

### Logs del Servidor

El sistema loggea automáticamente:

```bash
# Microservicio (Library)
[RpcGlobalExceptionFilter] Exception caught: {
  name: 'BookAlreadyExistsException',
  message: 'Book already exists. ...',
  exceptionName: 'BookAlreadyExistsException'
}

[RpcGlobalExceptionFilter] RPC Payload: {
  "status": 409,
  "details": [...],
  "meta": {...}
}

# Gateway
[GlobalExceptionFilter] PUT /library/create-book - 409
```

### Testing

Usa Postman o cualquier cliente HTTP para probar:

```http
PUT http://localhost:3000/library/create-book
Content-Type: application/json

{
  "isbn": "9780743273565"  // ISBN duplicado
}
```

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                     Gateway (HTTP)                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         GlobalExceptionFilter                     │  │
│  │  - Captura todas las excepciones HTTP            │  │
│  │  - Extrae payload de microservicios              │  │
│  │  - Retorna respuesta estandarizada               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           │ RPC (TCP)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  Microservice (Library)                  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │       RpcGlobalExceptionFilter                    │  │
│  │  - Captura DomainException                        │  │
│  │  - Captura ValueObjectException                   │  │
│  │  - Usa ExceptionExtractorService                  │  │
│  └──────────────────────────────────────────────────┘  │
│                           │                              │
│                           ▼                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │      ExceptionExtractorService                    │  │
│  │  - Detecta tipo de excepción                      │  │
│  │  - Usa Strategy Pattern                           │  │
│  │  - Construye payload estructurado                 │  │
│  └──────────────────────────────────────────────────┘  │
│                           │                              │
│            ┌──────────────┼──────────────┐              │
│            ▼              ▼              ▼              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │   Domain    │ │ ValueObject │ │    Http     │      │
│  │  Exception  │ │  Exception  │ │  Exception  │      │
│  │   Mapper    │ │   Mapper    │ │   Mapper    │      │
│  └─────────────┘ └─────────────┘ └─────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist para Nuevos Desarrolladores

Cuando crees una nueva excepción, verifica:

- [ ] ¿Extiendo la clase base correcta? (`DomainException` o `ValueObjectException`)
- [ ] ¿El nombre sigue las convenciones? (contiene `AlreadyExists`, `NotFound`, `Invalid`, etc.)
- [ ] ¿Paso el `{ClassName}.name` como segundo parámetro al `super()`?
- [ ] ¿El mensaje es descriptivo y útil para el frontend?
- [ ] ¿Probé la excepción en Postman y veo el status HTTP correcto?

---

## 🔧 Troubleshooting

### La excepción retorna 400 cuando debería ser 409

**Causa:** El nombre no contiene ningún patrón reconocido.

**Solución:** Renombra la excepción para incluir `AlreadyExists`, `Duplicate` o `Exists`.

```typescript
// ❌ MAL
export class BookExistsError extends DomainException { ... }

// ✅ BIEN
export class BookAlreadyExistsException extends DomainException { ... }
```

### El `exceptionType` muestra el nombre de la clase hija

**Causa:** Esto es normal. `exceptionType` muestra la clase base (`DomainException`), mientras que `exceptionName` muestra el nombre específico.

```json
"meta": {
    "exceptionType": "DomainException",        // ✅ Clase base
    "exceptionName": "BookAlreadyExistsException"  // ✅ Clase específica
}
```

### Necesito un status HTTP personalizado

**Solución:** Agrega una regla en `exception-mapping.rules.ts`:

```typescript
{
    patterns: ['TooLarge', 'Exceeds'],
    status: HttpStatus.PAYLOAD_TOO_LARGE, // 413
    priority: 10,
}
```
