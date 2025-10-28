import ValueObject from "@app/common-core/domain/value-objects/value-object";
import { BookAuthorException } from "../exceptions";

interface BookAuthorProps {
  value: string;
}

export class BookAuthor extends ValueObject<BookAuthorProps> {
  private constructor(private readonly value: string) {
    super({ value });
  }

  public static create(value: string): BookAuthor {
    if (!value || value.trim().length === 0) {
      throw new BookAuthorException('BookAuthor cannot be empty');
    }
    if (value.length > 150) {
      throw new BookAuthorException('BookAuthor cannot exceed 150 characters');
    }
    return new BookAuthor(value.trim());
  }

  public get getValue(): string {
    return this.value;
  }
}