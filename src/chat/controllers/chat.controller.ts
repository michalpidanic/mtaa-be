import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { NewChatDto } from '../dtos/chat.dto';
import { ChatService } from '../services/chat.service';
import { MessageService } from '../services/message.service';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('new')
  createChat(@Req() req, @Body() chatData: NewChatDto) {
    const creatorId = req.user.userId;
    return this.chatService.createChat(creatorId, chatData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/messages')
  fetchMessages(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.messageService.fetchMessages(req.params.id, req.user.userId, {
      page,
      limit,
    });
  }
}
