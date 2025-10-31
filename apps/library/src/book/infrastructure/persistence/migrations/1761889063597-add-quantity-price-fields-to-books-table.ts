import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { BOOK_TABLE_NAME } from "../entities/book.entity";

export class AddQuantityPriceFieldsToBooksTable1761889063597 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns(
            BOOK_TABLE_NAME,
            [
                new TableColumn({
                    name: 'QUANTITY',
                    type: 'int',
                    isNullable: false,
                    default: 0,
                }),
                new TableColumn({
                    name: 'PRICE',
                    type: 'decimal',
                    precision: 10,
                    scale: 2,
                    isNullable: false,
                    default: 0,
                })
            ]
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(BOOK_TABLE_NAME, 'QUANTITY');
        await queryRunner.dropColumn(BOOK_TABLE_NAME, 'PRICE');
    }

}
