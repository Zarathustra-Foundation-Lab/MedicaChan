"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
