"use client";

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { smartSearch, SmartSearchInput } from '@/ai/flows/smart-search';
import { useToast } from '@/hooks/use-toast';

export function SearchHandler() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);
    
    try {
        const searchInput: SmartSearchInput = { query };
        const response = await smartSearch(searchInput);
        setResults(response.results);
    } catch (error) {
        console.error("Search failed:", error);
        toast({
            variant: "destructive",
            title: "Search Error",
            description: "Failed to fetch search results. Please try again."
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  return (
    <>
      <div className="relative w-full max-w-md">
        <form onSubmit={handleSearch}>
          <Input
            type="search"
            placeholder="Search materials..."
            className="w-full bg-card pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => setIsOpen(true)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </form>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Smart Search</DialogTitle>
            <DialogDescription>
              Find materials based on keywords or questions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="e.g., 'What is the function of the cerebellum?'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </form>
          <div className="mt-4 min-h-[200px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ul className="space-y-2">
                {results.length > 0 ? (
                  results.map((result, index) => (
                    <li key={index} className="rounded-md border p-3 text-sm">
                      {result}
                    </li>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground pt-8">
                    No results yet. Start a search to see relevant materials.
                  </p>
                )}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
