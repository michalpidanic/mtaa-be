import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { forkJoin, from, map, of, switchMap } from 'rxjs';
import { UserService } from 'src/user/services/user.service';
import { Repository } from 'typeorm';
import { ChatEntity } from '../models/chat.entity';
import { MemberEntity } from '../models/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    private readonly userService: UserService,
  ) {}

  public addMembers(membersId: number[], adminId: number, chat: ChatEntity) {
    return of(membersId).pipe(
      switchMap((ids) => {
        const obs = ids.map((id) => this.userService.findOne(id));
        return forkJoin(obs);
      }),
      switchMap((users) => {
        const obs = users.map((user) => {
          const newMember = new MemberEntity();
          newMember.isAdmin = user.id === adminId;
          newMember.chat = chat;
          newMember.user = user;

          return from(this.memberRepository.save(newMember));
        });
        return forkJoin(obs);
      }),
    );
  }

  public checkMemberShip(chatId: number, userId: number) {
    return from(
      this.memberRepository.findOne({
        where: { chat: chatId, user: userId },
        relations: ['chat', 'user'],
      }),
    ).pipe(
      map((member) => {
        if (member == undefined) {
          throw new UnauthorizedException('Not a member of this chat');
        }
      }),
    );
  }

  public getMemberships(userId: number) {
    return from(
      this.memberRepository.find({
        where: { user: userId },
        relations: ['chat', 'user'],
      }),
    );
  }
}
