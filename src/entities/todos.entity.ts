import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Todos' })
export class Todos {
  @PrimaryGeneratedColumn('increment') // PrimaryGeneratedColumn 的主要功能是生成一個自增或者UUID（通用唯一標識符）類型的主鍵欄位。
  id: number;

  @Column()
  title: string;

  @Column({ default: false, type: 'boolean' })
  completed: boolean;
}
