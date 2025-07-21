import { MainLayout } from '@/components/layout/main-layout';
import { InteractiveNotebook } from '@/components/ai-learning/interactive-notebook';

export default function AILearningPage() {
  return (
    <MainLayout pageTitle="Belajar dengan AI">
      <InteractiveNotebook />
    </MainLayout>
  );
}
