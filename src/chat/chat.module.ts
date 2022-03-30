import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ChatController } from './controllers/chat.controller';
import { ChatEntity } from './models/chat.entity';
import { MemberEntity } from './models/member.entity';
import { MessageEntity } from './models/message.entity';
import { ChatService } from './services/chat.service';
import { MemberService } from './services/member.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity, MemberEntity, MessageEntity]),
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, MemberService],
})
export class ChatModule {}
