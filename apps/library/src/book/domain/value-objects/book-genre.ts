import ValueObject from "@app/common-core/domain/value-objects/value-object";
import { BookGenreException } from "../exceptions";

export enum BookGenreEnum {
  FICTION = 'FICTION',
  NON_FICTION = 'NON_FICTION',
  MYSTERY = 'MYSTERY',
  FANTASY = 'FANTASY',
  SCIENCE_FICTION = 'SCIENCE_FICTION',
  BIOGRAPHY = 'BIOGRAPHY',
  HISTORY = 'HISTORY',
  ROMANCE = 'ROMANCE',
  HORROR = 'HORROR',
  THRILLER = 'THRILLER',
  SELF_HELP = 'SELF_HELP',
  CHILDREN = 'CHILDREN',
  YOUNG_ADULT = 'YOUNG_ADULT',
  POETRY = 'POETRY',
  GRAPHIC_NOVEL = 'GRAPHIC_NOVEL',
  CLASSIC = 'CLASSIC',
  OTHER = 'OTHER'
}

interface BookGenreProps {
  value: BookGenreEnum;
}

export class BookGenre extends ValueObject<BookGenreProps> {
  private constructor(private readonly value: BookGenreEnum) {
    super({ value });
  }

  public static create(value: string): BookGenre {
    if (!Object.values(BookGenreEnum).includes(value as BookGenreEnum)) {
      throw new BookGenreException(`Invalid book genre: ${value}`);
    }
    return new BookGenre(value as BookGenreEnum);
  }

  public get getValue(): BookGenreEnum {
    return this.value;
  }
}