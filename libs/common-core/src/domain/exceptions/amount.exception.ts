import { ValueObjectException } from './value-object.exception';

export class AmountException extends ValueObjectException {
  constructor(message: string, details?: string) {
    super(`Invalid amount value: ${message}`, AmountException.name, details);
  }
}
