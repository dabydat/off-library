import { ValueObjectException } from "./value-object.exception";

export class BooleanVOException extends ValueObjectException {
  constructor(value: string, details?: string) {
    const message: string = `Boolean value is invalid: ${value}`;
    super(message, BooleanVOException.name, details);
  }
}
