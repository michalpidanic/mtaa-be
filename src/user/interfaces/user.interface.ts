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
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
