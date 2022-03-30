import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatEntity } from './chat.entity';

@Entity('meessage')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  mentions: string;

  @Column({ type: 'timestamp', default: null })
  lastRead: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: null })
  deletedAt: Date;

  @OneToOne((type) => UserEntity)
  @JoinColumn()
  sender: UserEntity;

  @ManyToOne((type) => ChatEntity, (chat) => chat.messages, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  chat: ChatEntity;
}
