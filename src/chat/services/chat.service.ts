import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { concat, concatMap, from, map, tap } from 'rxjs';
import { Repository } from 'typeorm';
import { NewChatInterface } from '../interfaces/chat.interface';
import { ChatEntity } from '../models/chat.entity';
import { MemberService } from './member.service';
import { MessageService } from './message.service';

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

  // public getUsersChats(options: IPaginationOptions, userId: number) {
  //   let response = {};
  //   return this.memberService.getMemberships(userId).pipe(
  //     tap((res) => (response = res)),
  //     switchMap((res) => {
  //       const obs = ids.map((id) => this.mess.findOne(id));
  //       return forkJoin(obs);
  //     }),
  //     switchMap((users) => {
  //       const obs = users.map((user) => {
  //         const newMember = new MemberEntity();
  //         newMember.isAdmin = user.id === adminId;
  //         newMember.chat = chat;
  //         newMember.user = user;

  //         return from(this.memberRepository.save(newMember));
  //       });
  //       return forkJoin(obs);
  //     }),
  //     map((memberships) => {
  //       return memberships;
  //     }),
  //   );
  // }
}
