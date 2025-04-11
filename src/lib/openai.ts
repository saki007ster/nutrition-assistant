import OpenAI from 'openai';
import { env } from './env';

if (!env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY
});

export default openai;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function getChatCompletion(messages: ChatMessage[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('Error getting chat completion:', error);
    throw error;
  }
}