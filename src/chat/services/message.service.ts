import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { concatMap, from, map } from 'rxjs';
import { UserService } from 'src/user/services/user.service';
import { Repository } from 'typeorm';
import {
  EditMessageInterface,
  SendMessageInterface,
} from '../interfaces/message.interface';
import { MessageEntity } from '../models/message.entity';
import { ChatService } from './chat.service';
import { MemberService } from './member.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly memberService: MemberService,
  ) {}

  public sendMessage(senderId: number, messageData: SendMessageInterface) {
    const newMessage = new MessageEntity();
    newMessage.text = messageData.text;
    newMessage.mentions = messageData.mentions;

    return this.memberService
      .checkMemberShip(messageData.chatId, senderId)
      .pipe(
        concatMap(() => this.userService.findOne(senderId)),
        map((user) => (newMessage.sender = user)),
        concatMap(() => this.chatService.findOne(messageData.chatId)),
        map((chat) => (newMessage.chat = chat)),
        concatMap(() => from(this.messageRepository.save(newMessage))),
      );
  }

  public editMessage(
    messageId: number,
    userId: number,
    messageData: EditMessageInterface,
  ) {
    return this.checkOwnership(messageId, userId).pipe(
      concatMap(() =>
        from(
          this.messageRepository.update(messageId, {
            text: messageData.text,
            mentions: messageData.mentions,
          }),
        ),
      ),
    );
  }

  public deleteMessage(messageId: number, userId: number) {
    return this.checkOwnership(messageId, userId).pipe(
      concatMap(() => from(this.messageRepository.softDelete(messageId))),
    );
  }

  public fetchMessages(
    chatId: number,
    userId: number,
    options: IPaginationOptions,
  ) {
    return this.memberService.checkMemberShip(chatId, userId).pipe(
      concatMap(() =>
        from(
          paginate<MessageEntity>(this.messageRepository, options, {
            relations: ['chat'],
            where: { chat: chatId },
          }),
        ),
      ),
    );
  }

  public checkOwnership(messageId: number, userId: number) {
    return from(
      this.messageRepository.findOne({
        where: { id: messageId, sender: userId },
        relations: ['sender'],
      }),
    ).pipe(
      map((message) => {
        if (message == undefined) {
          throw new UnauthorizedException('Not your message');
        }
      }),
    );
  }

  public findOne(messageId: number) {
    return from(this.messageRepository.findOne({ where: { id: messageId } }));
  }
}
