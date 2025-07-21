import { MainLayout } from '@/components/layout/main-layout';
import { ForumClientPage } from '@/components/forum/forum-client-page';

export default function ForumPage() {
  return (
    <MainLayout pageTitle="Forum Diskusi">
      <ForumClientPage />
    </MainLayout>
  );
}
