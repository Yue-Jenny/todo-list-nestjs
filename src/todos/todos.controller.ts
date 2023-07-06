import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Todo } from '../todos/todos.interface';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  /**
   * 取得所有 todo list
   * @returns todos
   */
  @Get()
  findAll(): Todo[] {
    const todos = this.todosService.findAll();
    return todos;
  }

  /**
   * 建立 todo list
   * @param todo
   * @returns todo
   */
  @Post()
  create(@Body() todo: Todo): Todo {
    this.todosService.create(todo);
    return todo;
  }

  /**
   *
   * @param id
   * @param todo
   * @returns todo or null
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() todo: Todo): Todo {
    const result = this.todosService.update(id, todo);
    return result;
  }

  /**
   * 刪除 todo list
   * @param id
   * @returns boolean
   */
  @Delete(':id')
  delete(@Param('id') id: string): boolean {
    const result = this.todosService.delete(id);
    return result;
  }
}
