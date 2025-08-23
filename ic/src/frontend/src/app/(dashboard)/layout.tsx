"use client";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  const { isAuth } = useAuth();

  if (!isAuth) {
    router.push("/");
  }

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
