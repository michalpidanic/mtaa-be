import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MemberEntity } from './member.entity';
import { MessageEntity } from './message.entity';

@Entity('chat')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: null })
  deletedAt: Date;

  @OneToMany((type) => MemberEntity, (member) => member.chat, {
    cascade: true,
  })
  members: MemberEntity[];

  @OneToMany((type) => MessageEntity, (message) => message.chat, {
    cascade: true,
  })
  messages: MessageEntity[];

  addMember(member: MemberEntity) {
    if (this.members == null) {
      this.members = Array<MemberEntity>();
    }
    this.members.push(member);
  }

  addMessage(message: MessageEntity) {
    if (this.messages == null) {
      this.messages = Array<MessageEntity>();
    }
    this.messages.push(message);
  }
}
