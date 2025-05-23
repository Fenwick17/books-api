import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
