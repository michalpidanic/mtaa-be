import { IsBoolean } from 'class-validator';

export class NotificationsDto {
    @IsBoolean()
    callNotifications: boolean

    @IsBoolean()
    messageNotifications: boolean

    @IsBoolean()
    mentionNotifications: boolean
}