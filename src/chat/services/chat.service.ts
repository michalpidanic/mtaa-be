import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, identity, switchMap, tap, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { NewChatInterface } from '../interfaces/chat.interface';
import { ChatEntity } from '../models/chat.entity';
import { MemberEntity } from '../models/member.entity';
import { MemberService } from './member.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    private readonly memberService: MemberService,
  ) {}

  public async createChat(creatorId: number, chatData: NewChatInterface) {
    const newChat = new ChatEntity();
    newChat.name = chatData.name;

    for (const userId of chatData.membersId) {
      const member = await this.memberService.createMember(userId, true);
      await this.addMember(member, newChat);
    }

    // return chatData.membersId.forEach((memberId) => {
    //   return this.memberService
    //     .createMember(memberId, memberId === creatorId)
    //     .pipe(
    //       tap((res) => console.log(res)),
    //       switchMap(async (member) => await this.addMember(member, newChat)),
    //     );
    // });
  }

  private async addMember(member: MemberEntity, chat: ChatEntity) {
    console.log(chat, member);
    chat.addMember(member);
    await this.chatRepository.save(chat);
  }
}
