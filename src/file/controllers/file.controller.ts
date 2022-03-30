import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';
import { FileUploadDto } from '../dtos/file.dto';
import { FileService } from '../services/file.service';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiUnauthorizedResponse()
  @ApiCreatedResponse()
  @ApiBody({
    description: 'File',
    type: FileUploadDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() messageId: { messageId: number },
    @Req() req,
  ) {
    const uploadRes = {
      originalName: file.originalname,
      fileName: file.filename,
      path: file.path,
      mimeType: file.mimetype,
    };

    return this.fileService.uploadFile(
      uploadRes,
      messageId.messageId,
      req.user.userId,
    );
  }

  @ApiUnauthorizedResponse()
  @ApiOkResponse()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getFile(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response,
  ) {
    const file = await lastValueFrom(this.fileService.getFile(id));

    const stream = createReadStream(join(process.cwd(), file.path));

    response.set({
      'Content-Disposition': `inline; filename="${file.fileName}"`,
      'Content-Type': file.mimeType,
    });
    return new StreamableFile(stream);
  }
}
