import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { DeleteResult } from 'typeorm';
import { Todos } from 'src/entities/todos.entity';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  /**
   * 取得所有 todo list
   * @returns todos
   */
  @Get()
  findAll(): Promise<Todos[]> {
    const todos = this.todosService.findAllTodos();
    return todos;
  }

  /**
   * 用 id 取得特定 todo 內容
   * @param id
   * @returns
   */
  @Get(':id')
  findById(@Param('id') id: string): Promise<Todos> {
    const todo = this.todosService.findOneTodoById(id);
    return todo;
  }

  /**
   * 建立 todo list
   * @param todo
   * @returns todo
   */
  @Post()
  create(@Body() todo: Todos): Todos {
    this.todosService.createTodo(todo);
    return todo;
  }

  /**
   * 更新 todo 內容
   * @param id
   * @param todo
   * @returns todo or null
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() todo: Todos): boolean {
    const result = this.todosService.updateTodo(id, todo);
    return result;
  }

  /**
   * 刪除 todo list
   * @param id
   * @returns boolean
   */
  @Delete(':id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    const result = this.todosService.deleteTodo(id);
    return result;
  }
}
