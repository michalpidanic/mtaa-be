import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { MemberEntity } from '../models/member.entity';

@Injectable()
export class MemberService {
  constructor(private readonly userService: UserService) {}

  public async createMember(userId: number, isAdmin: boolean) {
    const newMember = new MemberEntity();
    newMember.isAdmin = isAdmin;
    await this.userService.addChatMembership(newMember, userId);
    return newMember;
  }
}
