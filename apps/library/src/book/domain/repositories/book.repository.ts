import { Book } from "../models/book";

export const BOOK_REPOSITORY = Symbol('BOOK_REPOSITORY');

export interface BookRepository {
    findAll(): Promise<Book[]>;
}