import { Injectable } from '@nestjs/common';
import { Todo } from './todos.interface';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];

  create(todo: Todo) {
    this.todos.push(todo);
  }

  findAll(): Todo[] {
    return this.todos;
  }

  update(id: string, todo: Todo) {
    const parsedId = parseInt(id, 10);

    const index = this.todos.findIndex((item) => item.id === parsedId);
    if (index >= 0) {
      this.todos[index].title = todo.title;
      this.todos[index].completed = todo.completed;
      return this.todos[index];
    }
    return null;
  }

  delete(id: string) {
    const index = this.todos.findIndex((item) => item.id === parseInt(id, 10));
    if (index >= 0) {
      this.todos.splice(index, 1);
      return true;
    }
    return false;
  }
}
