import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { concatMap, from, map } from 'rxjs';
import { MessageService } from 'src/chat/services/message.service';
import { Repository } from 'typeorm';
import { FileInterface } from '../interfaces/file.interfaces';
import { FileEntity } from '../models/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {}

  public uploadFile(
    fileData: FileInterface,
    messageId: number,
    userId: number,
  ) {
    return this.messageService.checkOwnership(messageId, userId).pipe(
      concatMap(() => this.messageService.findOne(messageId)),
      concatMap((message) => {
        const newFile = new FileEntity();
        newFile.fileName = fileData.fileName;
        newFile.originalName = fileData.originalName;
        newFile.mimeType = fileData.mimeType;
        newFile.path = `${this.configService.get<string>('FILE_UPLOAD_PATH')}/${
          fileData.fileName
        }`;
        newFile.message = message;

        return from(this.fileRepository.save(newFile));
      }),
    );
  }

  public getFile(id: number) {
    return from(this.fileRepository.findOne({ where: { id } })).pipe(
      map((file) => {
        if (file == undefined) {
          throw new NotFoundException('File not found');
        }
        return file;
      }),
    );
  }
}
