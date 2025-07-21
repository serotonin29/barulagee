import { MainLayout } from '@/components/layout/main-layout';
import { ProgressOverview } from '@/components/dashboard/progress-overview';
import { Announcements } from '@/components/dashboard/announcements';
import { RecommendedMaterials } from '@/components/dashboard/recommended-materials';
import { FeatureShortcuts } from '@/components/dashboard/feature-shortcuts';

export default function DashboardPage() {
  return (
    <MainLayout pageTitle="Dashboard">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <ProgressOverview />
          <RecommendedMaterials />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <FeatureShortcuts />
          <Announcements />
        </div>
      </div>
    </MainLayout>
  );
}
