import { MainLayout } from '@/components/layout/main-layout';
import { QuizView } from '@/components/quizzes/quiz-view';

export default function QuizzesPage() {
  return (
    <MainLayout pageTitle="Interactive Quizzes">
        <QuizView />
    </MainLayout>
  );
}
