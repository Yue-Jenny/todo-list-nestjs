import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { Todos } from '../schema/todos';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { TodosDto } from './todos.dto';
import { Todo } from '../entity/todo';

// Using singleton scope is recommended for most use cases.
@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);
  constructor(
    @InjectRepository(Todos)
    private todosRepository: Repository<Todos>,
  ) {}

  findAllTodos(): Promise<Todo[]> {
    try {
      return this.todosRepository.find();
    } catch (error) {
      this.logger.error(`Find all todos error: ${error}`);
      throw new Error(error);
    }
  }

  findOneTodoById(id: string): Promise<Todo | null> {
    try {
      return this.todosRepository.findOneBy({ id: parseInt(id) });
    } catch (error) {
      this.logger.error(`Catch an error when finding all todos: ${error}`);
      throw new Error(error);
    }
  }

  deleteTodo(id: string): Promise<DeleteResult> {
    try {
      this.logger.log(`Delete a todo, id: ${id}`);
      return this.todosRepository.softDelete({ id: parseInt(id) });
    } catch (error) {
      this.logger.error(`Delete a todo error: ${error}`);
      throw new Error(error);
    }
  }

  async updateTodo(id: string, newTodo: TodosDto): Promise<Todo> {
    this.logger.log(`Update a todo, id: ${id}`);

    let record = null;
    try {
      record = await this.todosRepository
        .createQueryBuilder()
        .update(Todos)
        .set({
          ...newTodo,
        })
        .where('todos.id = :id', {
          id: parseInt(id),
        })
        .andWhere('todos.deletedDate is NULL')
        .execute();
    } catch (error) {
      this.logger.error(`Update a todo error: ${error}`);
      throw new Error(error);
    }

    if (!record.affected) {
      this.logger.error(`Id:${id} record is not exist.`);
      throw new NotFoundException(`Id:${id} record is not exist.`);
    }

    const updatedTodo = new Todo();
    updatedTodo.id = parseInt(id);
    updatedTodo.title = newTodo.title;
    updatedTodo.completed = newTodo.completed;
    return updatedTodo;
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
