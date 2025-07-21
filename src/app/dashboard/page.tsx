import { MainLayout } from '@/components/layout/main-layout';
import { ProgressOverview } from '@/components/dashboard/progress-overview';
import { Announcements } from '@/components/dashboard/announcements';
import { RecommendedMaterials } from '@/components/dashboard/recommended-materials';
import { FeatureShortcuts } from '@/components/dashboard/feature-shortcuts';
import { MotivationCarousel } from '@/components/dashboard/motivation-carousel';

export default function DashboardPage() {
  return (
    <MainLayout pageTitle="Dashboard">
      <div className="space-y-8">
        <MotivationCarousel />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <ProgressOverview />
            <RecommendedMaterials />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <FeatureShortcuts />
            <Announcements />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
