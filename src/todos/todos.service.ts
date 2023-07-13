import { Logger, Injectable } from '@nestjs/common';
import { Todos } from '../entities/todos.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

// Using singleton scope is recommended for most use cases.
@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);
  constructor(
    @InjectRepository(Todos)
    private todosRepository: Repository<Todos>,
  ) {}

  findAllTodos(): Promise<Todos[]> {
    try {
      return this.todosRepository.find();
    } catch (error) {
      this.logger.error(`Find all todos error: ${error}`);
      throw new Error(error);
    }
  }

  findOneTodoById(id: string): Promise<Todos | null> {
    try {
      return this.todosRepository.findOneBy({ id: parseInt(id) });
    } catch (error) {
      this.logger.error(`Find all todos error: ${error}`);
      throw new Error(error);
    }
  }

  deleteTodo(id: string): Promise<DeleteResult> {
    try {
      this.logger.log(`Delete a todo, id: ${id}`);
      return this.todosRepository.delete({ id: parseInt(id) });
    } catch (error) {
      this.logger.error(`Delete a todo error: ${error}`);
      throw new Error(error);
    }
  }

  updateTodo(id: string, newTodo: Todos): boolean {
    try {
      this.logger.log(`Update a todo, id: ${id}`);
      this.todosRepository.update(
        { id: parseInt(id) },
        {
          ...newTodo,
        },
      );
      return true;
    } catch (error) {
      this.logger.error(`Update a todo error: ${error}`);
      throw new Error(error);
    }
  }

  createTodo(todo: Todos) {
    try {
      this.todosRepository.insert({
        title: todo.title,
        completed: todo.completed,
      });
    } catch (error) {
      this.logger.error(`Create a todo error: ${error}`);
      throw new Error(error);
    }
  }
}
