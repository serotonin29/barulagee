import { Sidebar } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Header } from './header';
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget';
import { cn } from '@/lib/utils';

type MainLayoutProps = {
  children: React.ReactNode;
  pageTitle: string;
};

export function MainLayout({ children, pageTitle }: MainLayoutProps) {
  const isAILearningPage = pageTitle === "";

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarNav />
      <div className={cn(
        "flex flex-col",
        !isAILearningPage && "sm:gap-4 sm:py-4 sm:pl-14"
      )}>
        {!isAILearningPage && <Header pageTitle={pageTitle} />}
        <main className={cn(
          "grid flex-1 items-start",
          !isAILearningPage && "gap-4 p-4 sm:px-6 sm:py-0 md:gap-8"
        )}>
          {children}
        </main>
      </div>
      {!isAILearningPage && <ChatbotWidget />}
    </div>
  );
}
