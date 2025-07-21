import { MainLayout } from '@/components/layout/main-layout';
import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table';

export default function LeaderboardPage() {
  return (
    <MainLayout pageTitle="Papan Peringkat">
        <LeaderboardTable />
    </MainLayout>
  );
}
