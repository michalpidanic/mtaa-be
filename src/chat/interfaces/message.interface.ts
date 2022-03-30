export interface SendMessageInterface {
  text: string;
  mentions: string;
  chatId: number;
}

export interface EditMessageInterface {
  text: string;
  mentions: string;
}
