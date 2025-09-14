"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, History, User, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Logo } from "@/app/(landing)/components/navbar/logo";
import { Badge } from "./ui/badge";
import { useUserProfile } from "@/hooks/use-backend";
import { useAuth } from "@/providers/auth-provider";

export function AppSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  const { principal } = useAuth();
  const { data: userData, refetch } = useUserProfile(
    principal?.toString() || ""
  );

  const isActive = (url: string) => url === pathname;

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Add Checkup",
      url: "/add-checkup",
      icon: PlusCircle,
    },
    {
      title: "History",
      url: "/history",
      icon: History,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
  ];

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  useEffect(() => {
    refetch();
  }, [userData, refetch, principal]);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-2 pt-2">
          <Logo />
          <ThemeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Rewards</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 dark:bg-muted/50 border">
                <div>
                  <p className="text-sm font-medium">Total Rewards</p>
                  <p className="text-xs text-muted-foreground">$MEDCN Tokens</p>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {userData?.total_rewards.toString()}
                </Badge>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
