import { Pagination } from "@app/common-core/domain/value-objects/pagination";
import { Book } from "../models/book";
import { DomainPagination } from "@app/common-core/domain/types/domain-pagination.type";
import { BookISBN } from "../value-objects";
import { Uuid } from "@app/common-core/domain/value-objects";

export const BOOK_REPOSITORY = Symbol('BOOK_REPOSITORY');

export interface BookRepositoryPort {
    findAll(pagination: Pagination): Promise<DomainPagination<Book[]>>;
    save(book: Book): Promise<Book>;
    findBookByISBN(isbn: BookISBN): Promise<Book | null>;
    findBookById(id: Uuid): Promise<Book | null>;
}