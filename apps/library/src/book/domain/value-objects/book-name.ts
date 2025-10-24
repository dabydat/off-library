import ValueObject from "@app/common-core/domain/value-objects/value-object";
import { BookNameException } from "../exceptions";

interface BookNameProps {
  value: string;
}

export class BookName extends ValueObject<BookNameProps> {
  private constructor(private readonly value: string) {
    super({ value });
  }

  public static create(value: string): BookName {
    if (!value || value.trim().length === 0) {
      throw new BookNameException('BookName cannot be empty');
    }
    if (value.length > 50) {
      throw new BookNameException('BookName cannot exceed 50 characters');
    }
    return new BookName(value.trim());
  }

  public get getValue(): string {
    return this.value;
  }
}