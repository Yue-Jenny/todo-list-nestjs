import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterTodosIdToAutoIncrement1688872463639
  implements MigrationInterface
{
  name = 'alterTodosIdToAutoIncrement1688872463639';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE Todos
      MODIFY COLUMN id int NOT NULL AUTO_INCREMENT PRIMARY KEY`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE Todos
    MODIFY COLUMN id int`,
    );
  }
}
