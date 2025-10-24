import ValueObject from "@app/common-core/domain/value-objects/value-object";
import { BookLanguageException } from "../exceptions";

export enum BookLanguageEnum {
  ENGLISH = 'ENGLISH',
  SPANISH = 'SPANISH',
  FRENCH = 'FRENCH',
  GERMAN = 'GERMAN',
  ITALIAN = 'ITALIAN',
  PORTUGUESE = 'PORTUGUESE',
  RUSSIAN = 'RUSSIAN',
  CHINESE = 'CHINESE',
  JAPANESE = 'JAPANESE',
  KOREAN = 'KOREAN',
  ARABIC = 'ARABIC',
  HINDI = 'HINDI',
  BENGALI = 'BENGALI',
  TURKISH = 'TURKISH',
  DUTCH = 'DUTCH',
  POLISH = 'POLISH',
  SWEDISH = 'SWEDISH',
  NORWEGIAN = 'NORWEGIAN',
  DANISH = 'DANISH',
  FINNISH = 'FINNISH',
  GREEK = 'GREEK',
  HEBREW = 'HEBREW',
  CZECH = 'CZECH',
  ROMANIAN = 'ROMANIAN',
  HUNGARIAN = 'HUNGARIAN',
  OTHER = 'OTHER'
}

interface BookLanguageProps {
  value: BookLanguageEnum;
}

export class BookLanguage extends ValueObject<BookLanguageProps> {
  private constructor(private readonly value: BookLanguageEnum) {
    super({ value });
  }

  public static create(value: string): BookLanguage {
    if (!Object.values(BookLanguageEnum).includes(value as BookLanguageEnum)) {
      throw new BookLanguageException(`Invalid book language: ${value}`);
    }
    return new BookLanguage(value as BookLanguageEnum);
  }

  public get getValue(): BookLanguageEnum {
    return this.value;
  }
}