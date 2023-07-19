import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todos } from '../schema/todos';
import { Repository } from 'typeorm';
import { TodosService } from './todos.service';
import { TodosDto } from './todos.dto';
import { NotFoundException } from '@nestjs/common';

describe('TodosService', () => {
  let service: TodosService;
  let repository: Repository<Todos>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todos),
          useClass: Repository, // useClass: you supply a class that will be instantiated to provide the instance to override the object (provider, guard, etc.).
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get<Repository<Todos>>(getRepositoryToken(Todos));
  });

  afterEach(() => {
    jest.resetAllMocks(); // Resets the state of all mocks.
  });

  describe('findAllTodos', () => {
    // it: Creates a test closure.
    it('should return an array of todos', async () => {
      const mockTodos: Todos[] = [
        {
          id: 1,
          title: 'Todo 1',
          completed: false,
          deletedDate: new Date(),
        },
        {
          id: 2,
          title: 'Todo 2',
          completed: true,
          deletedDate: new Date(),
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockTodos);

      const result = await service.findAllTodos();

      expect(result).toEqual(mockTodos);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if finding todos fails', async () => {
      const error = new Error('Find todos error');
      jest.spyOn(repository, 'find').mockRejectedValue(error);

      await expect(service.findAllTodos()).rejects.toThrowError(error);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneTodoById', () => {
    it('should return a todo by ID', async () => {
      const mockTodo: Todos = {
        id: 1,
        title: 'Todo 1',
        completed: false,
        deletedDate: new Date(),
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockTodo);

      const result = await service.findOneTodoById('1');

      expect(result).toEqual(mockTodo);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if todo is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      const result = await service.findOneTodoById('1');

      expect(result).toBeUndefined();
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if finding a todo fails', async () => {
      const error = new Error('Find todo error');
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(error);

      await expect(service.findOneTodoById('1')).rejects.toThrowError(error);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo by ID', async () => {
      const deleteResult = { affected: 1 } as any;

      jest.spyOn(repository, 'softDelete').mockResolvedValue(deleteResult);

      const result = await service.deleteTodo('1');

      expect(result).toEqual(deleteResult);
      expect(repository.softDelete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an error if deleting a todo fails', async () => {
      const error = new Error('Delete todo error');
      jest.spyOn(repository, 'softDelete').mockRejectedValue(error);

      await expect(service.deleteTodo('1')).rejects.toThrowError(error);
      expect(repository.softDelete).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('updateTodo', () => {
    it('should update a todo by ID', async () => {
      const createQueryBuilderMock: jest.Mock = jest
        .fn()
        .mockImplementation(() => ({
          update: jest.fn().mockReturnThis(),
          set: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValueOnce({ affected: 1 }), // 假設這次的 update 有影響到 1 筆資料
        }));

      //Partial: Make all properties in T optional
      const todosRepository: Partial<Repository<Todos>> = {
        createQueryBuilder: createQueryBuilderMock,
      };

      const todosService = new TodosService(todosRepository as any);

      const id = '1';
      const newTodo: TodosDto = {
        title: 'updated todo',
        completed: false,
      };

      const result = await todosService.updateTodo(id, newTodo);

      expect(result).toEqual({
        id: parseInt(id),
        title: newTodo.title,
        completed: newTodo.completed,
      });
    });

    it('should throw NotFoundException if no record affected', async () => {
      // 模擬了一個資料庫查詢器的行為。這個模擬物件允許我們鏈接多個方法，並且每個方法都返回自身，以方便方法的串連。
      const createQueryBuilderMock: jest.Mock = jest
        .fn()
        // 使用 mockImplementation 可以對函數進行模擬，以便在測試中使用模擬的版本，而不是實際執行的版本。
        .mockImplementation(() => ({
          update: jest.fn().mockReturnThis(),
          set: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValueOnce({ affected: 0 }), // 假設這次的 update 沒有影響到任何資料
        }));

      // 部分（partial）的 Todos Repository 的模擬物件。
      // 其中的 createQueryBuilder 方法被設置為之前創建的 createQueryBuilderMock。
      const todosRepository: Partial<Repository<Todos>> = {
        createQueryBuilder: createQueryBuilderMock,
      };

      const todosService = new TodosService(todosRepository as any);

      const id = '1';
      const newTodo: TodosDto = {
        title: 'updated todo',
        completed: false,
      };

      // 使用 expect 斷言來測試 todosService.updateTodo 方法是否拋出了 NotFoundException。
      // 由於在模擬的資料庫查詢中，沒有資料被修改，預期應該拋出 NotFoundException。
      await expect(todosService.updateTodo(id, newTodo)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // 使用 describe 函數來定義一個測試套件，名為 'createTodo'，包含兩個測試案例。
  describe('createTodo', () => {
    it('should create a new todo', async () => {
      // as any 被用於將 insertResult 物件斷言為 any 型別。any 型別是 TypeScript 中的頂級型別，表示任意型別。
      // const insertResult = { identifiers: [{ id: 0 }] } as any;
      const insertResult = { identifiers: [{ id: 0 }] } as any;
      const newTodo: TodosDto = {
        title: 'New Todo',
        completed: false,
      };

      // mockResolvedValue 可以幫助你在測試中模擬異步函數的解析值
      // 使用 jest.spyOn 函數來模擬 repository 物件中的 insert 方法，並使用 mockResolvedValue 指定該方法的解析值為 insertResult。這樣一來，在測試中調用 service.createTodo 時，insert 方法將返回模擬的結果。
      jest.spyOn(repository, 'insert').mockResolvedValue(insertResult);

      // 呼叫 service.createTodo 方法以測試其行為。
      await service.createTodo(newTodo);

      // 使用 expect 斷言來驗證 repository.insert 方法是否被正確呼叫並傳遞了預期的參數。
      expect(repository.insert).toHaveBeenCalledWith({
        title: newTodo.title,
        completed: newTodo.completed,
      });
    });

    it('should throw an error if creating a todo fails', async () => {
      jest.spyOn(repository, 'insert').mockRejectedValue('Create todo error');

      // 使用 expect 斷言來驗證 service.createTodo 方法是否拋出了預期的錯誤，並確保錯誤訊息為 'Create todo error'。
      // 而 service.createTodo 是一個 async function，所以要加上 await，等非同步 function 執行完畢。
      await expect(service.createTodo({} as TodosDto)).rejects.toThrowError(
        'Create todo error',
      );

      // 使用 expect 斷言來驗證 repository.insert 方法是否被正確呼叫並傳遞了預期的參數。
      // Ensure that a mock function is called with specific arguments.
      expect(repository.insert).toHaveBeenCalledWith({});
    });
  });
});
