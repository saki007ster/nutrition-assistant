import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { Message } from '@/types/chat';
import { UserProfile } from '@/types/database';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory rate limiting
const RATE_LIMIT_DURATION = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 20;
const requestLog = new Map<string, { count: number; timestamp: number }>();

function getRateLimitInfo(ip: string): { isAllowed: boolean; timeRemaining: number } {
  const now = Date.now();
  const userRequests = requestLog.get(ip);

  if (!userRequests) {
    requestLog.set(ip, { count: 1, timestamp: now });
    return { isAllowed: true, timeRemaining: 0 };
  }

  const timeDiff = now - userRequests.timestamp;
  if (timeDiff > RATE_LIMIT_DURATION) {
    requestLog.set(ip, { count: 1, timestamp: now });
    return { isAllowed: true, timeRemaining: 0 };
  }

  if (userRequests.count >= MAX_REQUESTS_PER_MINUTE) {
    const timeRemaining = RATE_LIMIT_DURATION - timeDiff;
    return { isAllowed: false, timeRemaining };
  }

  requestLog.set(ip, { count: userRequests.count + 1, timestamp: userRequests.timestamp });
  return { isAllowed: true, timeRemaining: 0 };
}

// Clean up old rate limit entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of requestLog.entries()) {
    if (now - data.timestamp > RATE_LIMIT_DURATION) {
      requestLog.delete(ip);
    }
  }
}, RATE_LIMIT_DURATION);

interface ChatRequest {
  message: string;
  userProfile: UserProfile;
  history: Message[];
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // Check rate limit
    const { isAllowed, timeRemaining } = getRateLimitInfo(ip);
    if (!isAllowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please try again in ${Math.ceil(timeRemaining / 1000)} seconds.`
        },
        { status: 429 }
      );
    }

    const { message, userProfile, history = [] } = await request.json() as ChatRequest;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile is required' },
        { status: 400 }
      );
    }

    // Create a system message that includes the user's profile information
    const systemMessage = `You are a knowledgeable and helpful nutrition assistant. Here's important information about the user:
- Dietary preferences: ${userProfile.dietary_preferences?.join(', ') || 'None specified'}
- Allergies: ${userProfile.allergies?.join(', ') || 'None specified'}
- Health goals: ${userProfile.health_goals?.join(', ') || 'None specified'}
- Medical conditions: ${userProfile.medical_conditions?.join(', ') || 'None specified'}
- Favorite cuisines: ${userProfile.favorite_cuisines?.join(', ') || 'None specified'}
- Disliked ingredients: ${userProfile.disliked_ingredients?.join(', ') || 'None specified'}
- Activity level: ${userProfile.activity_level || 'Not specified'}
- Cooking experience: ${userProfile.cooking_experience || 'Not specified'}
- Meal plan preference: ${userProfile.meal_plan_preference || 'Not specified'}

Always consider these preferences and restrictions when providing advice. Be friendly and supportive while ensuring all recommendations are safe and appropriate for the user's profile.

Format your responses using these rules:
1. Use "###Title###" to create clear section headers (e.g., ###Recipe### or ###Ingredients### or ###Instructions###)
2. For lists of ingredients, use bullet points with "-" at the start of each line
3. For step-by-step instructions, use numbered steps (1., 2., etc.)
4. Keep paragraphs short and use line breaks for better readability
5. For recipes, always structure them as:
   ###Recipe Name###
   Brief description or context
   ###Ingredients###
   - List ingredients with quantities
   ###Instructions###
   1. Step one
   2. Step two
   etc.
   ###Nutritional Notes### (if applicable)
   Additional information about nutrition, variations, or tips`;

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: systemMessage },
      ...(Array.isArray(history) ? history.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })) : []),
      { role: "user", content: message },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!response.choices[0].message.content) {
      throw new Error('No response content received from OpenAI');
    }

    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat request';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}