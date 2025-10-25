import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BookEntity } from "../persistence/entities/book.entity";
import { Repository } from "typeorm";
import { Book } from "../../domain/models/book";
import { BookMapper } from "../mappers/book.mapper";
import { BookRepositoryPort } from "../../domain/ports/book-repository.port";
import { Pagination } from "@app/common-core/domain/value-objects/pagination";
import { DomainPagination } from "@app/common-core/domain/types/domain-pagination.type";


@Injectable()
export class BookRepositoryAdapter implements BookRepositoryPort {
    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,
    ) { }

    async findAll(pagination: Pagination): Promise<DomainPagination<Book[]>> {
        const query = this.bookRepository.createQueryBuilder('book')
        const [data, dataQty] = await query.skip(pagination.getOffset)
            .take(pagination.getLimit)
            .getManyAndCount();

        const books = BookMapper.toBook(data);

        return new DomainPagination<Book[]>(
            books,
            dataQty,
            pagination.getTotalPages(dataQty),
            pagination.getPage,
            pagination.getLimit
        );
    }

}
