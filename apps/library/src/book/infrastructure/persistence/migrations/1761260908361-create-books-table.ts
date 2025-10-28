import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { BOOK_TABLE_NAME } from "../entities/book.entity";

export class CreateBooksTable1761260908361 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: BOOK_TABLE_NAME,
            columns: [
                {
                    name: 'ID',
                    type: 'uuid',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'NAME',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'AUTHOR',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'ISBN',
                    type: 'varchar',
                    length: '20',
                    isNullable: false,
                },
                {
                    name: 'PUBLISHER',
                    type: 'varchar',
                    length: '255',
                    isNullable: false,
                },
                {
                    name: 'PUBLICATION_DATE',
                    type: 'datetime',
                    isNullable: false,
                },
                {
                    name: 'GENRE',
                    type: 'varchar',
                    length: '50',
                    isNullable: false,
                },
                {
                    name: 'PAGES',
                    type: 'tinyint',
                    isNullable: false,
                },
                {
                    name: 'LANGUAGE',
                    type: 'varchar',
                    length: '50',
                    isNullable: false,
                },
                {
                    name: 'SUMMARY',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'CREATED_AT',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'UPDATED_AT',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                    onUpdate: 'CURRENT_TIMESTAMP',
                }
            ],
            indices: [
                {
                    name: 'IDX_BOOK_ISBN',
                    columnNames: ['ISBN'],
                    isUnique: true,
                },
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(BOOK_TABLE_NAME, true, true, true);
    }

}
