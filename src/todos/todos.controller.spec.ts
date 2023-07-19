import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { DeleteResult, Repository } from 'typeorm';
import { Todo } from '../entity/todo';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todos } from '../schema/todos';
import { TodosDto } from './todos.dto';

describe('TodosController', () => {
  let todosController: TodosController;
  let todosService: TodosService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todos),
          useClass: Repository, // useClass: you supply a class that will be instantiated to provide the instance to override the object (provider, guard, etc.).
        },
      ],
    }).compile();

    todosService = moduleRef.get<TodosService>(TodosService);
    todosController = moduleRef.get<TodosController>(TodosController);
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const mockTodos: Todo[] = [
        { id: 1, title: 'Todo 1', completed: false },
        { id: 2, title: 'Todo 2', completed: false },
      ];

      jest.spyOn(todosService, 'findAllTodos').mockResolvedValue(mockTodos);

      const result = await todosController.findAll();

      expect(result).toEqual(mockTodos);
    });
  });

  describe('findById', () => {
    it('should return a specific todo by id', async () => {
      const mockTodo: Todo = { id: 1, title: 'Todo 1', completed: false };

      jest.spyOn(todosService, 'findOneTodoById').mockResolvedValue(mockTodo);

      const result = await todosController.findById('1');

      expect(result).toEqual(mockTodo);
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const mockTodo: TodosDto = { title: 'New Todo', completed: false };
      const todo: Todo = { id: 1, title: 'New Todo', completed: false };

      jest.spyOn(todosService, 'createTodo').mockResolvedValue(todo);

      const result = await todosController.create(mockTodo);

      expect(result).toEqual(todo);
      expect(todosService.createTodo).toHaveBeenCalledWith(mockTodo);
    });
  });

  describe('update', () => {
    it('should update an existing todo', async () => {
      const mockTodo: TodosDto = {
        title: 'Updated Todo',
        completed: false,
      };

      const todo: Todo = { id: 1, title: 'New Todo', completed: false };

      jest.spyOn(todosService, 'updateTodo').mockResolvedValue(todo);

      const result = await todosController.update('1', mockTodo);

      expect(result).toBe(todo);
      expect(todosService.updateTodo).toHaveBeenCalledWith('1', mockTodo);
    });
  });

  describe('delete', () => {
    it('should delete an existing todo', async () => {
      const deleteResult: DeleteResult = {
        raw: {},
        affected: 1,
      };

      jest.spyOn(todosService, 'deleteTodo').mockResolvedValue(deleteResult);

      const result = await todosController.delete('1');

      expect(result).toEqual(deleteResult);
      expect(todosService.deleteTodo).toHaveBeenCalledWith('1');
    });
  });
});
