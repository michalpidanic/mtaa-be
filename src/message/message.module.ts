import { Module } from '@nestjs/common';
import { MessageController } from './controllers/message.controller';

@Module({
  controllers: [MessageController]
})
export class MessageModule {}
