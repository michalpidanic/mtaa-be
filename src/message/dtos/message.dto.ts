import { IsNotEmpty, IsString } from 'class-validator';

export class SendDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}