import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1689096953208 implements MigrationInterface {
  name = 'Init1689096953208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "favourites" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "favourites" ADD CONSTRAINT "UQ_b75b5e4a2475d03acfe11eac1d1" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "favourites" ADD CONSTRAINT "FK_b75b5e4a2475d03acfe11eac1d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "favourites" DROP CONSTRAINT "FK_b75b5e4a2475d03acfe11eac1d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favourites" DROP CONSTRAINT "UQ_b75b5e4a2475d03acfe11eac1d1"`,
    );
    await queryRunner.query(`ALTER TABLE "favourites" DROP COLUMN "userId"`);
  }
}
