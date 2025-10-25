import { ValueObjectException } from './value-object.exception';

export class PaginationException extends ValueObjectException {
  constructor(message: string, details?: string) {
    super(`Invalid pagination value: ${message}`, PaginationException.name, details);
  }
}
