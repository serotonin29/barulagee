import type { ForumReply } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowUp, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ThreadReply({ reply }: { reply: ForumReply }) {
    return (
        <Card className={reply.isVerified ? 'border-primary bg-primary/5' : ''}>
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={reply.authorAvatar} alt={reply.authorName} data-ai-hint="user avatar" />
                        <AvatarFallback>{reply.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{reply.authorName}</span>
                                <span className="text-xs text-muted-foreground">• {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
                            </div>
                            {reply.isVerified && (
                                <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                                    <Award className="h-4 w-4" />
                                    Jawaban Terverifikasi
                                </div>
                            )}
                        </div>
                        <p className="text-sm">{reply.content}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 justify-end">
                <Button variant="ghost" size="sm">
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Vote ({reply.upvotes})
                </Button>
            </CardFooter>
        </Card>
    )
}
