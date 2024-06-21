export enum MessageType {
  Reply,
  UserMessage
}

export interface MessageProps {
  text: string;
  messageType: MessageType;
  provider?: string;
  model?: string;
}

export interface Conversation {
  id: string;
  messages: MessageProps[];
  title: string;
}
