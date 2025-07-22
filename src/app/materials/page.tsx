import { MainLayout } from '@/components/layout/main-layout';
import { MaterialsClientPage } from '@/components/materials/materials-client-page';
import { driveItems } from '@/lib/data';

export default function MaterialsPage() {
  return (
    <MainLayout pageTitle="Materi">
      <MaterialsClientPage initialItems={driveItems} />
    </MainLayout>
  );
}
