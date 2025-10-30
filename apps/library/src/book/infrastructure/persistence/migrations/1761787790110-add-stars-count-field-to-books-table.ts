import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { BOOK_TABLE_NAME } from "../entities/book.entity";

export class AddStarsCountFieldToBooksTable1761787790110 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(BOOK_TABLE_NAME, new TableColumn({
            name: 'STARS_COUNT',
            type: 'int',
            default: 0,
            isNullable: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(BOOK_TABLE_NAME, "STARS_COUNT");
    }

}
