import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ChatController } from './controllers/chat.controller';
import { MessageController } from './controllers/message.controller';
import { ChatEntity } from './models/chat.entity';
import { MemberEntity } from './models/member.entity';
import { MessageEntity } from './models/message.entity';
import { ChatService } from './services/chat.service';
import { MemberService } from './services/member.service';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity, MemberEntity, MessageEntity]),
    UserModule,
  ],
  controllers: [ChatController, MessageController],
  providers: [ChatService, MemberService, MessageService],
})
export class ChatModule {}
