import { INestApplication, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFile } from 'fs/promises';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthService } from './auth/services/auth.service';
import { ChatController } from './chat/controllers/chat.controller';
import { MessageController } from './chat/controllers/message.controller';
import { ChatService } from './chat/services/chat.service';
import { MemberService } from './chat/services/member.service';
import { MessageService } from './chat/services/message.service';
import { FileController } from './file/controllers/file.controller';
import { FileService } from './file/services/file.service';
import { RedisService } from './redis/services/redis.service';
import { UserController } from './user/controllers/user.controller';
import { UserService } from './user/services/user.service';

// @nestjs/swagger requires running application. However, it's not possible to start the application
// if there are dependecies on external services like mongoDB, rabbitmq, etc.
// Solution is to compose an app which contains just REST controllers.
@Module({
  imports: [],
  controllers: [
    AuthController,
    UserController,
    FileController,
    ChatController,
    MessageController,
  ],
  providers: [
    {
      provide: AuthService,
      useValue: {},
    },
    {
      provide: UserService,
      useValue: {},
    },
    {
      provide: FileService,
      useValue: {},
    },
    {
      provide: ChatService,
      useValue: {},
    },
    {
      provide: MessageService,
      useValue: {},
    },
    {
      provide: MemberService,
      useValue: {},
    },
    {
      provide: RedisService,
      useValue: {},
    },
  ],
})
export class OnlyControllersModule {}

async function generateSwaggerDocs(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('MTAA Chat app API')
    .setDescription(
      'The chat app API description for subject Mobile Technologies and Applications on FIIT STU',
    )
    .setVersion('1.0')
    .addServer('http://localhost:8000/api')
    .build();
  const spec = SwaggerModule.createDocument(app, config);

  return writeFile('openapi.json', JSON.stringify(spec));
}

async function bootstrap() {
  const app = await NestFactory.create(OnlyControllersModule);
  return generateSwaggerDocs(app);
}

bootstrap();
