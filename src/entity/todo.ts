import { IsString, IsBoolean, Length, IsNumber } from 'class-validator';

// 封裝 response 的物件資訊
export class Todo {
  @IsNumber()
  id: number;

  @Length(1, 30)
  @IsString()
  title: string;

  @IsBoolean()
  completed: boolean;
}
