"use client";

import { useState } from 'react';
import { Loader2, Send, Sparkles, Trash2, BookCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { aiChatbot, AIChatbotInput } from '@/ai/flows/ai-chatbot';

type NotebookBlock = {
  id: string;
  type: 'user' | 'ai';
  content: string;
};

export function InteractiveNotebook() {
  const [blocks, setBlocks] = useState<NotebookBlock[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useLocalContext, setUseLocalContext] = useState(true);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userBlock: NotebookBlock = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input,
    };
    setBlocks((prev) => [...prev, userBlock]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Implement RAG vs Non-RAG logic here.
      // If useLocalContext is true, the smartSearch tool should be used
      // to find relevant materials and inject them into the prompt.
      const chatInput: AIChatbotInput = { query: currentInput };
      const response = await aiChatbot(chatInput);

      const aiBlock: NotebookBlock = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: response.response,
      };
      setBlocks((prev) => [...prev, aiBlock]);
    } catch (error) {
      console.error('AI Learning error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to get a response. Please try again.',
      });
      // Remove the user's query block if the AI fails
      setBlocks((prev) => prev.filter((block) => block.id !== userBlock.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setBlocks([]);
    setInput('');
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
                <Switch 
                    id="local-context-switch" 
                    checked={useLocalContext} 
                    onCheckedChange={setUseLocalContext}
                />
                <Label htmlFor="local-context-switch" className="flex items-center gap-2">
                    <BookCheck className="h-4 w-4"/>
                    <span>Gunakan Konteks Lokal</span>
                </Label>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleClear} disabled={blocks.length === 0 || isLoading}>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Semua
            </Button>
        </div>
      </div>
      <ScrollArea className="flex-grow p-4">
        <div className="max-w-4xl mx-auto space-y-6">
            {blocks.length === 0 && !isLoading && (
                 <div className="text-center text-muted-foreground py-16">
                    <Sparkles className="mx-auto h-12 w-12 mb-4"/>
                    <h2 className="text-2xl font-semibold">Notebook Interaktif AI</h2>
                    <p>Mulai sesi belajar Anda dengan mengajukan pertanyaan di bawah.</p>
                </div>
            )}
            {blocks.map((block) => (
                <Card key={block.id} className={block.type === 'user' ? 'bg-primary/10' : 'bg-card'}>
                    <CardContent className="p-4">
                        <pre className="text-sm whitespace-pre-wrap font-sans">{block.content}</pre>
                    </CardContent>
                </Card>
            ))}
            {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>AI sedang berpikir...</span>
                </div>
            )}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4 bg-background/80 backdrop-blur-sm">
        <div className="relative max-w-4xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan apa saja kepada AI... (Shift+Enter untuk baris baru)"
            className="pr-20 min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button 
            size="icon" 
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="animate-spin"/> : <Send />}
          </Button>
        </div>
      </div>
    </div>
  );
}
