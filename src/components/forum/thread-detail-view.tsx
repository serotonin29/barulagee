import type { ForumThread, ForumReply } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowUp, CheckCircle, Award } from 'lucide-react';
import { format } from 'date-fns';
import { ReplyForm } from './reply-form';
import { ThreadReply } from './thread-reply';

export function ThreadDetailView({ thread }: { thread: ForumThread }) {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <Badge variant="outline" className="mb-2 w-fit">{thread.topic}</Badge>
                    <CardTitle className="text-2xl md:text-3xl">{thread.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={thread.authorAvatar} alt={thread.authorName} data-ai-hint="user avatar" />
                            <AvatarFallback>{thread.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{thread.authorName}</span>
                        <span>•</span>
                        <span>{format(new Date(thread.createdAt), "PPP")}</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{thread.content}</p>
                </CardContent>
                <CardFooter className="flex items-center gap-4">
                    <Button variant="outline">
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Vote ({thread.upvotes})
                    </Button>
                     {thread.isAnswered && (
                        <Badge variant="secondary" className="flex items-center gap-1 text-green-600">
                           <CheckCircle className="h-4 w-4" /> Terjawab
                        </Badge>
                    )}
                </CardFooter>
            </Card>

            <div className="space-y-6">
                <h3 className="text-xl font-semibold">{thread.replies.length} Balasan</h3>
                 {thread.replies.map(reply => (
                    <ThreadReply key={reply.id} reply={reply} />
                ))}
            </div>

            <Separator />
            
            <div>
                 <h3 className="text-xl font-semibold mb-4">Kontribusi Anda</h3>
                 <ReplyForm threadId={thread.id} />
            </div>
        </div>
    );
}
