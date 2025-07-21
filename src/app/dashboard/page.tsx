import { MainLayout } from '@/components/layout/main-layout';
import { ProgressOverview } from '@/components/dashboard/progress-overview';
import { Announcements } from '@/components/dashboard/announcements';
import { RecommendedMaterials } from '@/components/dashboard/recommended-materials';

export default function DashboardPage() {
  return (
    <MainLayout pageTitle="Dashboard">
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <ProgressOverview />
          <RecommendedMaterials />
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
          <Announcements />
        </div>
      </div>
    </MainLayout>
  );
}
