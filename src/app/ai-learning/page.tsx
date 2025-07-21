import { MainLayout } from '@/components/layout/main-layout';
import { NotebookList } from '@/components/ai-learning/notebook-list';

export default function AILearningPage() {
  return (
    <MainLayout pageTitle="">
      <NotebookList />
    </MainLayout>
  );
}
