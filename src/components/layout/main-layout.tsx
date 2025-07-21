import { Sidebar, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { Header } from './header';
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget';

type MainLayoutProps = {
  children: React.ReactNode;
  pageTitle: string;
};

export function MainLayout({ children, pageTitle }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header pageTitle={pageTitle} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}
