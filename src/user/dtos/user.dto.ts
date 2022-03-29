import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NotificationsDto {
    callNotifications: boolean
    messageNotifications: boolean
    mentionNotifications: boolean
}