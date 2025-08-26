"use client";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const { isAuth, userProfileData } = useAuthRedirect();

  // if (isAuth && userProfileData)
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col flex-1 min-w-0">
        <AppHeader />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
