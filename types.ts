export interface Contact {
  id: string;
  name: string;
  phone: string;
  isPrimary: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  HOME = 'HOME',
  CONTACTS = 'CONTACTS',
  ASSISTANT = 'ASSISTANT',
  SOS_ACTIVE = 'SOS_ACTIVE'
}