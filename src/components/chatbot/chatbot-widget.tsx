"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { aiChatbot, AIChatbotInput } from '@/ai/flows/ai-chatbot';
import type { ChatMessage as ChatMessageType } from '@/types';
import { ChatMessage } from './chat-message';
import { useToast } from '@/hooks/use-toast';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      role: 'assistant',
      message: 'Hello! How can I help you with your studies today?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessageType = {
      id: String(Date.now()),
      role: 'user',
      message: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatInput: AIChatbotInput = { query: input, contextualSearch: true };
      const response = await aiChatbot(chatInput);
      const assistantMessage: ChatMessageType = {
        id: String(Date.now() + 1),
        role: 'assistant',
        message: response.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      toast({
        variant: 'destructive',
        title: 'Chatbot Error',
        description: 'Failed to get a response. Please try again.',
      });
      setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Open Chat</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>AI Assistant</SheetTitle>
            <SheetDescription>
              Ask me anything about your learning materials.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-grow my-4 pr-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && (
                 <div className="flex items-start gap-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary"/>
                 </div>
              )}
            </div>
          </ScrollArea>
          <SheetFooter>
            <form onSubmit={handleFormSubmit} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
