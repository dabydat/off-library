import { ValueObjectException } from "./value-object.exception";

export class TinyIntVOException extends ValueObjectException {
  constructor(value: number, details?: string) {
    const message: string = `Tinyint value is invalid: ${value}`;
    super(message, TinyIntVOException.name, details);
  }
}
