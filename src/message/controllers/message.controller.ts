import { Controller, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { SendDto } from '../dtos/message.dto';

@Controller('message')
export class MessageController {
  @Post('send')
  send(@Body() message: SendDto) 
  {
      return message.text;
  }

  @Post('fetch')
  fetch(@Body() message: SendDto)
  {
      return message.text;
  }

  @Delete(':id')
  delete(@Param('id') id)
  {
      return id;
  }

  @Put(':id')
  edit(@Param('id') id, @Body() message: SendDto)
  {
      return id + message.text;
  }

  
}