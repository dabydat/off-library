import ValueObject from "@app/common-core/domain/value-objects/value-object";
import { BookISBNException } from "../exceptions";

/**
 * Value object for Book ISBN.
 * 
 * - Validates that the ISBN is not empty.
 * - Normalizes the input by removing spaces and hyphens.
 * - Ensures the ISBN is either 10 or 13 digits (ISBN-10 or ISBN-13).
 * - Throws a custom exception if invalid.
 * - Uses a static factory method for controlled instantiation.
 * - Provides a getter for the value.
 */

interface BookISBNProps {
  value: string;
}

export class BookISBN extends ValueObject<BookISBNProps> {
  private constructor(private readonly value: string) {
    super({ value });
  }

  public static create(value: string): BookISBN {
    if (!value || value.trim().length === 0) {
      throw new BookISBNException('BookISBN cannot be empty');
    }
    const trimmed = value.replace(/[-\s]/g, "");
    if (!/^\d{10}(\d{3})?$/.test(trimmed)) {
      throw new BookISBNException('BookISBN must be a valid ISBN-10 or ISBN-13');
    }
    return new BookISBN(trimmed);
  }

  public get getValue(): string {
    return this.value;
  }
}