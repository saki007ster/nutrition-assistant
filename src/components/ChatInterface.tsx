'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { UserProfile } from '@/types/database';
import { Message } from '@/types/chat';

interface ChatInterfaceProps {
  userProfile: UserProfile;
}

function formatAssistantMessage(content: string): React.ReactNode {
  // Split the content by sections (###Title###)
  const sections = content.split(/###(.+?)###/).filter(Boolean);

  return sections.map((section, index) => {
    // If it's a title (odd indices in the split array)
    if (index % 2 === 0) {
      // Process the content section
      const processedContent = section
        // Convert numbered lists (e.g., "1. Step one" to proper HTML)
        .split('\n')
        .map(line => {
          // Check if it's a list item (starts with "- " or "1. ")
          if (line.trim().startsWith('- ')) {
            return `<li class="ml-4">${line.trim().substring(2)}</li>`;
          }
          if (/^\d+\.\s/.test(line.trim())) {
            return `<li class="ml-4">${line.trim().substring(line.indexOf(' ') + 1)}</li>`;
          }
          return line;
        })
        .join('\n');

      return <div key={index} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: processedContent }} />;
    } else {
      // It's a title
      return (
        <h3 key={index} className="font-bold text-lg mt-4 mb-2 text-blue-600">
          {section}
        </h3>
      );
    }
  });
}

export default function ChatInterface({ userProfile }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setIsLoading(true);

    const newUserMessage: Message = { 
      role: 'user', 
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userProfile,
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response. Please try again.');
      console.error('Error:', err);
      // Remove the user message if we failed to get a response
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>👋 Hi! I&apos;m your nutrition assistant. I can help you with:</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Personalized meal planning</li>
                <li>• Recipe suggestions</li>
                <li>• Nutritional advice</li>
                <li>• Diet-specific recommendations</li>
              </ul>
              <p className="mt-2 text-sm">How can I assist you today?</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'bg-white shadow-sm border border-blue-100'
                  }`}
                >
                  {message.role === 'assistant'
                    ? formatAssistantMessage(message.content)
                    : message.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-white shadow-sm border border-blue-100">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex justify-center">
              <div className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t border-blue-100 bg-white p-4 sticky bottom-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow min-h-[44px] max-h-32 bg-white/80 backdrop-blur-sm border-blue-100 focus:border-blue-500 focus:ring-blue-500"
            rows={1}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  );
}