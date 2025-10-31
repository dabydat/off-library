import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export const BOOK_TABLE_NAME = "BOOKS";

@Entity({ name: BOOK_TABLE_NAME })
export class BookEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'ID' })
    public id: string;

    @Column({ name: 'NAME', type: "varchar", length: 255 })
    public name: string;

    @Column({ name: 'AUTHOR', type: "varchar", length: 255 })
    public author: string;

    @Column({ name: 'ISBN', type: "varchar", length: 20 })
    public isbn: string;

    @Column({ name: 'PUBLISHER', type: "varchar", length: 255 })
    public publisher: string;

    @Column({ name: 'PUBLICATION_DATE', type: "datetime" })
    public publicationDate: Date;

    @Column({ name: 'GENRE', type: "varchar", length: 50 })
    public genre: string;

    @Column({ name: 'PAGES', type: "tinyint" })
    public pages: number;

    @Column({ name: 'LANGUAGE', type: "varchar", length: 50 })
    public language: string;

    @Column({ name: 'SUMMARY', type: "text", nullable: true })
    public summary?: string;

    @CreateDateColumn({ name: 'CREATED_AT', type: 'datetime' })
    public createdAt: Date;

    @UpdateDateColumn({ name: 'UPDATED_AT', type: 'datetime' })
    public updatedAt: Date;

    @Column({ name: 'STARS_COUNT', type: "int", default: 0 })
    public starsCount: number;

    @Column({ name: 'QUANTITY', type: 'int', default: 0 })
    public quantity: number;

    @Column({ name: 'PRICE', type: 'decimal', precision: 10, scale: 2, default: 0 })
    public price: number;

    constructor(entity: Partial<BookEntity>) {
        Object.assign(this, entity);
    }
}