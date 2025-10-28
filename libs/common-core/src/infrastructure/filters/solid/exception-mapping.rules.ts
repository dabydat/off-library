import { HttpStatus } from '@nestjs/common';

export interface ExceptionMappingRule {
    patterns: string[];
    status: number;
    priority?: number;
}

export const EXCEPTION_MAPPING_RULES: ExceptionMappingRule[] = [
    {
        patterns: ['AlreadyExists', 'Duplicate', 'Exists'],
        status: HttpStatus.CONFLICT,
        priority: 10,
    },
    {
        patterns: ['NotFound', 'Missing', 'DoesNotExist'],
        status: HttpStatus.NOT_FOUND,
        priority: 10,
    },
    {
        patterns: ['Unauthorized', 'Unauthenticated', 'NotAuthenticated'],
        status: HttpStatus.UNAUTHORIZED,
        priority: 10,
    },
    {
        patterns: ['Forbidden', 'AccessDenied', 'PermissionDenied'],
        status: HttpStatus.FORBIDDEN,
        priority: 10,
    },
    {
        patterns: ['Invalid', 'Malformed', 'Bad'],
        status: HttpStatus.BAD_REQUEST,
        priority: 5,
    },
];