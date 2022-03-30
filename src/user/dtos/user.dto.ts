import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { PaginationMetaDto } from 'src/common/dtos/common.dto';

export class NotificationsDto {
  @ApiProperty()
  @IsBoolean()
  callNotifications: boolean;

  @ApiProperty()
  @IsBoolean()
  messageNotifications: boolean;

  @ApiProperty()
  @IsBoolean()
  mentionNotifications: boolean;
}

// response dtos
export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  callNotifications: boolean;

  @ApiProperty()
  messageNotifications: boolean;

  @ApiProperty()
  mentionNotifications: boolean;

  @ApiProperty()
  lastSeen: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}

export class PaginatedUserResponseDto {
  @ApiProperty({ type: UserResponseDto, isArray: true })
  items: UserResponseDto[];

  @ApiProperty()
  meta: PaginationMetaDto;
}
