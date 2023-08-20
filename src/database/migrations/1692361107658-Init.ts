import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1692361107658 implements MigrationInterface {
    name = 'Init1692361107658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track" ADD "file" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "file"`);
    }

}
