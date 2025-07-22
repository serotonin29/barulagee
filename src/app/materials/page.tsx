import { MainLayout } from '@/components/layout/main-layout';
import { MaterialsClientPage } from '@/components/materials/materials-client-page';

export default function MaterialsPage() {
  return (
    <MainLayout pageTitle="Katalog Materi">
      <MaterialsClientPage />
    </MainLayout>
  );
}
