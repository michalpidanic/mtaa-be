import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concatMap, from } from 'rxjs';
import { Repository } from 'typeorm';
import { NewChatInterface } from '../interfaces/chat.interface';
import { ChatEntity } from '../models/chat.entity';
import { MemberService } from './member.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    private readonly memberService: MemberService,
  ) {}

  public createChat(adminId: number, chatData: NewChatInterface) {
    const newChat = new ChatEntity();
    newChat.name = chatData.name;
    return from(this.chatRepository.save(newChat)).pipe(
      concatMap((chat) => {
        return this.memberService.addMembers(chatData.membersId, adminId, chat);
      }),
    );
  }

  public findOne(chatId: number) {
    return from(this.chatRepository.findOne({ where: { id: chatId } }));
  }
}
