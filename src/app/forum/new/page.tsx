import { MainLayout } from '@/components/layout/main-layout';
import { NewThreadForm } from '@/components/forum/new-thread-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function NewThreadPage() {
  return (
    <MainLayout pageTitle="Mulai Diskusi Baru">
      <Card>
        <CardHeader>
          <CardTitle>Buat Thread Diskusi Baru</CardTitle>
          <CardDescription>
            Ajukan pertanyaan Anda kepada komunitas. Pastikan untuk menjelaskannya secara detail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewThreadForm />
        </CardContent>
      </Card>
    </MainLayout>
  );
}
