import { MainLayout } from '@/components/layout/main-layout';
import { ThreadDetailView } from '@/components/forum/thread-detail-view';
import { forumThreads } from '@/lib/data';

export default function ThreadDetailPage({ params }: { params: { threadId: string } }) {
  const thread = forumThreads.find(t => t.id === params.threadId);

  if (!thread) {
    return (
      <MainLayout pageTitle="Thread Not Found">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">404 - Thread Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The discussion thread you are looking for does not exist.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle={thread.title}>
      <ThreadDetailView thread={thread} />
    </MainLayout>
  );
}
