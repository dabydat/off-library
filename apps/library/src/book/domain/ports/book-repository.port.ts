import { Pagination } from "@app/common-core/domain/value-objects/pagination";
import { Book } from "../models/book";
import { DomainPagination } from "@app/common-core/domain/types/domain-pagination.type";

export const BOOK_REPOSITORY = Symbol('BOOK_REPOSITORY');

export interface BookRepositoryPort {
    findAll(pagination: Pagination): Promise<DomainPagination<Book[]>>;
}