import { MainLayout } from '@/components/layout/main-layout';
import { ProgressOverview } from '@/components/dashboard/progress-overview';
import { Announcements } from '@/components/dashboard/announcements';
import { RecommendedMaterials } from '@/components/dashboard/recommended-materials';
import { FeatureShortcuts } from '@/components/dashboard/feature-shortcuts';

export default function DashboardPage() {
  return (
    <MainLayout pageTitle="Dashboard">
      <div className="space-y-4">
        <FeatureShortcuts />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <ProgressOverview />
            <RecommendedMaterials />
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
            <Announcements />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
