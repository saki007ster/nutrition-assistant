export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
} 