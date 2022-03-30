import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { EditMessageDto, SendMessageDto } from '../dtos/message.dto';
import { MessageService } from '../services/message.service';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('send')
  sendMessage(@Req() req, @Body() messageData: SendMessageDto) {
    const senderId = req.user.userId;
    return this.messageService.sendMessage(senderId, messageData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  editMessage(@Req() req, @Body() messageData: EditMessageDto) {
    return this.messageService.editMessage(
      req.params.id,
      req.user.userId,
      messageData,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteMessage(@Req() req) {
    return this.messageService.deleteMessage(req.params.id, req.user.userId);
  }
}
