export interface NewUserInterface {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}

export interface UserEntityInterface {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  email: string;
  messageNotifications: boolean;
  callNotifications: boolean;
  mentionNotifications: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface UserNotificationsInterface {
  callNotifications: boolean;
  messageNotifications: boolean;
  mentionNotifications: boolean;
}
