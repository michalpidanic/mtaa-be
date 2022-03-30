import { MemberEntity } from 'src/chat/models/member.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  passwordHash: string;

  @Column({ unique: true })
  email: string;

  @Column( "boolean", { default: true })
  messageNotifications: boolean;

  @Column( "boolean", { default: true })
  callNotifications: boolean;

  @Column( "boolean", { default: true })
  mentionNotifications: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastSeen: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: null })
  deletedAt: Date;

  @OneToMany((type) => MemberEntity, (member) => member.user, {
    cascade: true,
  })
  memberInChats: MemberEntity[];

  addChatMembership(chat: MemberEntity) {
    if (this.memberInChats == null) {
      this.memberInChats = Array<MemberEntity>();
    }
    this.memberInChats.push(chat);
  }
}
