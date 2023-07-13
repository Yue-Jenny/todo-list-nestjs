import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const options: MysqlConnectionOptions = {
  type: 'mysql',
  host: '',
  port: 3306,
  username: '',
  password: '',
  database: '',
  synchronize: false,
  migrations: ['src/migrations/*.{ts,js}'],
  entities: ['src/entities/*.{ts,js}'],
  migrationsTableName: 'custom_migration_table',
};

export default new DataSource(options);
