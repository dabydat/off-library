import { v4 as uuidv4 } from 'uuid';
import ValueObject from './value-object';
import { UuidException } from '../exceptions/uuid.exception';

interface UuidProps {
  value: string;
}

export class Uuid extends ValueObject<UuidProps> {
  private constructor(private readonly value: string) {
    super({ value });
  }

  public static create(value?: string): Uuid {
    value = value ?? uuidv4();

    Uuid.validate(value!);

    return new Uuid(value!);
  }

  private static validate(value: string): void {
    const uuidRegex: RegExp =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    if (!uuidRegex.test(value)) {
      throw new UuidException('Invalid ID format', value);
    }
  }

  public get getValue(): string {
    return this.value;
  }
}
