import ValueObject from "@app/common-core/domain/value-objects/value-object";
import { BookPublisherException } from "../exceptions";

interface BookPublisherProps {
  value: string;
}

export class BookPublisher extends ValueObject<BookPublisherProps> {
  private constructor(private readonly value: string) {
    super({ value });
  }

  public static create(value: string): BookPublisher {
    if (!value || value.trim().length === 0) {
      throw new BookPublisherException('BookPublisher cannot be empty');
    }
    if (value.length > 50) {
      throw new BookPublisherException('BookPublisher cannot exceed 50 characters');
    }
    return new BookPublisher(value.trim());
  }

  public get getValue(): string {
    return this.value;
  }
}