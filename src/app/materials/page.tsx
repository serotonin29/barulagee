import { MainLayout } from '@/components/layout/main-layout';
import { MaterialCatalog } from '@/components/materials/material-catalog';

export default function MaterialsPage() {
  return (
    <MainLayout pageTitle="Material Catalog">
      <MaterialCatalog />
    </MainLayout>
  );
}
