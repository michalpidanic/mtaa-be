import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from 'src/chat/chat.module';
import { FileController } from './controllers/file.controller';
import { FileEntity } from './models/file.entity';
import { FileService } from './services/file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity]),
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get<string>('FILE_UPLOAD_PATH'),
      }),
      inject: [ConfigService],
    }),
    ChatModule,
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
