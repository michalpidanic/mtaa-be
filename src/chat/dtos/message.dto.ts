import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  mentions: string;

  @IsNumber()
  @IsNotEmpty()
  chatId: number;
}

export class EditMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  mentions: string;
}
