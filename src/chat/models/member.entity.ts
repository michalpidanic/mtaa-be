import { UserEntity } from 'src/user/models/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatEntity } from './chat.entity';

@Entity('member')
export class MemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isAdmin: boolean;

  @Column({ type: 'timestamp', default: null })
  lastRead: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: null })
  deletedAt: Date;

  @ManyToOne((type) => ChatEntity, (chat) => chat.members)
  chat: ChatEntity;

  @ManyToOne((type) => UserEntity, (user) => user.memberInChats)
  user: UserEntity;
}
