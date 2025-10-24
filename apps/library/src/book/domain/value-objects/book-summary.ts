import ValueObject from "@app/common-core/domain/value-objects/value-object";
import { BookSummaryException } from "../exceptions";

interface BookSummaryProps {
  value: string;
}

export class BookSummary extends ValueObject<BookSummaryProps> {
  private constructor(private readonly value: string) {
    super({ value });
  }

  public static create(value: string): BookSummary {
    if (!value || value.trim().length === 0) {
      throw new BookSummaryException('BookSummary cannot be empty');
    }
    if (value.length > 300) {
      throw new BookSummaryException('BookSummary cannot exceed 300 characters');
    }
    return new BookSummary(value.trim());
  }

  public get getValue(): string {
    return this.value;
  }
}