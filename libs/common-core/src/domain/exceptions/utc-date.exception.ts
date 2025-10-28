import { ValueObjectException } from './value-object.exception';

export class UtcDateException extends ValueObjectException {
  constructor(value: string, details?: string) {
    super(`Invalid date value. ${value}`, UtcDateException.name, details);
  }
}
