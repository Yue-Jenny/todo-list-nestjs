import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDeletedDate1689580895247 implements MigrationInterface {
  name = 'addDeletedDate1689580895247';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = `ALTER TABLE Todos ADD deletedDate datetime(6) NULL`;
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sql = `ALTER TABLE Todos DROP COLUMN deletedDate`;
    await queryRunner.query(sql);
  }
}
