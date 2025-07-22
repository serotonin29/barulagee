"use client";

import { useState } from 'react';
import Link from 'next/link';
import { forumThreads as allThreads } from '@/lib/data';
import type { ForumThread } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ForumThreadCard } from './forum-thread-card';
import { PlusCircle } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';


export function ForumClientPage() {
    const [threads, setThreads] = useState<ForumThread[]>(allThreads);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const filteredThreads = threads
        .filter(thread => thread.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortBy === 'popular') {
                return b.upvotes - a.upvotes;
            }
            return 0;
        });

    const topics = ['All', ...Array.from(new Set(allThreads.map(t => t.topic)))];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Cari pertanyaan atau thread..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-full md:max-w-sm"
                    />
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                     <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px] md:w-[180px]">
                            <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Terbaru</SelectItem>
                            <SelectItem value="popular">Terpopuler</SelectItem>
                            <SelectItem value="unanswered">Belum Terjawab</SelectItem>
                        </SelectContent>
                    </Select>
                    <Link href="/forum/new" passHref>
                        <Button>
                            <PlusCircle className="mr-0 md:mr-2 h-4 w-4" />
                            <span className="hidden md:inline">Mulai Diskusi</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <Tabs defaultValue="All" className="w-full">
                <ScrollArea className="w-full whitespace-nowrap">
                    <TabsList>
                        {topics.map(topic => (
                            <TabsTrigger key={topic} value={topic}>{topic}</TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                {topics.map(topic => (
                    <TabsContent key={topic} value={topic} className="mt-4">
                        <div className="space-y-4">
                            {(topic === 'All' ? filteredThreads : filteredThreads.filter(t => t.topic === topic)).map(thread => (
                                <ForumThreadCard key={thread.id} thread={thread} />
                            ))}
                             {(topic === 'All' ? filteredThreads : filteredThreads.filter(t => t.topic === topic)).length === 0 && (
                                <div className="text-center py-16 text-muted-foreground">
                                    <p>Tidak ada thread untuk topik ini.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
