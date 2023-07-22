import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { DeleteResult } from 'typeorm';
import { TodosDto } from './todos.dto';
import { Todo } from '../entity/todo';

@Controller('/api/v1/todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  /**
   * 取得所有 todo list
   * @returns todos
   */
  @Get()
  findAll(): Promise<Todo[]> {
    const todos = this.todosService.findAllTodos();
    return todos;
  }

  /**
   * 用 id 取得特定 todo 內容
   * @param id
   * @returns
   */
  @Get(':id')
  findById(@Param('id') id: string): Promise<Todo> {
    const todo = this.todosService.findOneTodoById(id);
    return todo;
  }

  /**
   * 建立 todo
   * @param todo
   * @returns todo
   */
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() todo: TodosDto) {
    const createTodoResult = this.todosService.createTodo(todo);
    return createTodoResult;
  }

  /**
   * 更新 todo 內容
   * @param id
   * @param todo
   * @returns todo or null
   */
  @Put(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() todo: TodosDto) {
    const updateTodoResult = this.todosService.updateTodo(id, todo);
    return updateTodoResult;
  }

  /**
   * 刪除 todo
   * @param id
   * @returns boolean
   */
  @Delete(':id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    const deleteTodoResult = this.todosService.deleteTodo(id);
    return deleteTodoResult;
  }
}
