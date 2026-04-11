import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface Props {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppLayout({ children, title, subtitle }: Props) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 bg-background sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground" />
            {title && (
              <div>
                <h1 className="text-sm font-semibold text-foreground leading-none">{title}</h1>
                {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
              </div>
            )}
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
