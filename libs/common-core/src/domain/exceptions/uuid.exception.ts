import { ValueObjectException } from "./value-object.exception";

export class UuidException extends ValueObjectException {
  constructor(value: string, details?: string) {
    super(`Invalid ID value. ${value}`, UuidException.name, details);
  }
}


