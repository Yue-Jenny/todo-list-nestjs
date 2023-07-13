import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodosTable1688790766175 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE Todos (
        id int,
        title varchar(255),
        completed varchar(255)
    );`,
    );
  }

  // reverts things made in "up" method
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE Todos (
      id int,
      title varchar(255),
      completed varchar(255)
  );`,
    );
  }
}
