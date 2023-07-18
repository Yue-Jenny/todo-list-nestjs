import { IsString, IsBoolean, Length } from 'class-validator';

export class TodosDto {
  @Length(1, 30)
  @IsString()
  title: string;

  @IsBoolean()
  completed: boolean;
}
