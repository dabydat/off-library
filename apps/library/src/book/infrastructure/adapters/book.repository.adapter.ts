import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BookEntity } from "../persistence/entities/book.entity";
import { Repository } from "typeorm";
import { Book } from "../../domain/models/book";
import { BookMapper } from "../mappers/book.mapper";
import { BookRepositoryPort } from "../../domain/ports/book-repository.port";
import { Pagination } from "@app/common-core/domain/value-objects/pagination";
import { DomainPagination } from "@app/common-core/domain/types/domain-pagination.type";
import { BookISBN } from "../../domain/value-objects";
import { Uuid } from "@app/common-core/domain/value-objects/uuid";


@Injectable()
export class BookRepositoryAdapter implements BookRepositoryPort {
    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,
    ) { }

    async findBookByISBN(isbn: BookISBN): Promise<Book | null> {
        const bookEntity = await this.bookRepository.findOne({ where: { isbn: isbn.getValue } });
        return bookEntity ? BookMapper.toBook(bookEntity) : null;
    }

    async findAll(pagination: Pagination): Promise<DomainPagination<Book[]>> {
        const query = this.bookRepository.createQueryBuilder('book')
        const [data, dataQty] = await query.skip(pagination.getOffset)
            .take(pagination.getLimit)
            .getManyAndCount();

        const books = BookMapper.toBookMany(data);

        return new DomainPagination<Book[]>(
            books,
            dataQty,
            pagination.getTotalPages(dataQty),
            pagination.getPage,
            pagination.getLimit
        );
    }

    async findBookById(id: Uuid): Promise<Book | null> {
        const bookEntity = await this.bookRepository.findOne({ where: { id: id.getValue } });
        return bookEntity ? BookMapper.toBook(bookEntity) : null;
    }

    async save(book: Book): Promise<Book> {
        const bookEntity = await this.bookRepository.save(BookMapper.toBookEntity(book));
        return BookMapper.toBook(bookEntity);
    }
}
