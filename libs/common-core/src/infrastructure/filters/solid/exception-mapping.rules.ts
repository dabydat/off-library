import { HttpStatus } from '@nestjs/common';

export interface ExceptionMappingRule {
    patterns: string[]; // Patrones de nombre que matchean
    status: number;
    priority?: number; // Mayor prioridad = se evalúa primero
}

export const EXCEPTION_MAPPING_RULES: ExceptionMappingRule[] = [
    // Conflictos (409)
    {
        patterns: ['AlreadyExists', 'Duplicate', 'Exists'],
        status: HttpStatus.CONFLICT,
        priority: 10,
    },

    // Not Found (404)
    {
        patterns: ['NotFound', 'Missing', 'DoesNotExist'],
        status: HttpStatus.NOT_FOUND,
        priority: 10,
    },

    // Unauthorized (401)
    {
        patterns: ['Unauthorized', 'Unauthenticated', 'NotAuthenticated'],
        status: HttpStatus.UNAUTHORIZED,
        priority: 10,
    },

    // Forbidden (403)
    {
        patterns: ['Forbidden', 'AccessDenied', 'PermissionDenied'],
        status: HttpStatus.FORBIDDEN,
        priority: 10,
    },

    // Bad Request (400)
    {
        patterns: ['Invalid', 'Malformed', 'Bad'],
        status: HttpStatus.BAD_REQUEST,
        priority: 5,
    },
];