import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from './../../../domain/repositories/book.repository';
import { Injectable } from "@nestjs/common";
import { BookEntity } from '../entities/book.entity';
import { Repository } from 'typeorm';
import { Book } from '../../../domain/models/book';
import { BookMapper } from '../../mappers/book.mapper';
import path from 'path';

@Injectable()
export class BookRepositoryImpl implements BookRepository {
    constructor(
        @InjectRepository(BookEntity)
        private readonly bookRepository: Repository<BookEntity>,
    ) { }

    async findAll(): Promise<Book[]> {
        console.log('Using SQLite DB at:', process.env.DATABASE_PATH, process.env.DATABASE_NAME);
        const books = await this.bookRepository.find();
        return BookMapper.toBook(books);
    }

}
