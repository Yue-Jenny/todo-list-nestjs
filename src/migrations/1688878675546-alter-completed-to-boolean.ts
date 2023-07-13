import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterCompletedToBoolean1688878675546
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sql = `
    ALTER TABLE Todos MODIFY COLUMN completed BOOLEAN;`;

    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sql = `
    ALTER TABLE Todos MODIFY COLUMN completed varchar(255);`;

    await queryRunner.query(sql);
  }
}
