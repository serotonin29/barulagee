import Link from 'next/link';
import type { ForumThread } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ArrowUp, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ForumThreadCard({ thread }: { thread: ForumThread }) {
    return (
        <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="outline" className="mb-2">{thread.topic}</Badge>
                        <CardTitle className="text-lg">
                            <Link href={`/forum/${thread.id}`} className="hover:underline">
                                {thread.title}
                            </Link>
                        </CardTitle>
                    </div>
                     {thread.isAnswered && (
                        <Badge variant="secondary" className="flex items-center gap-1 text-green-600">
                           <CheckCircle className="h-4 w-4" /> Terjawab
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {thread.content}
                </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={thread.authorAvatar} alt={thread.authorName} data-ai-hint="user avatar" />
                        <AvatarFallback>{thread.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{thread.authorName}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <ArrowUp className="h-4 w-4" /> {thread.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" /> {thread.replyCount}
                    </span>
                </div>
            </CardFooter>
        </Card>
    )
}
