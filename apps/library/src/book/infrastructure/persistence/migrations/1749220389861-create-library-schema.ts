import { LIBRARY_SCHEMA } from "@app/common-core/domain/constants/schema.constant";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateServicePaymentSchema1749220389861 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createSchema(LIBRARY_SCHEMA, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropSchema(LIBRARY_SCHEMA, true);
    }

}
