import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { from } from 'rxjs';
import { NewChatDto } from '../dtos/chat.dto';
import { ChatService } from '../services/chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('new')
  createChat(@Req() req, @Body() chatData: NewChatDto) {
    const creatorId = req.user.userId;
    return this.chatService.createChat(creatorId, chatData);
  }
}
