"use client";

import { ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

const user = {
  name: "John Doe",
};

export const AppHeader = () => {
  const { logout } = useAuth();

  const [showModalLogout, setShowModalLogout] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="border-b p-2 flex items-center justify-between gap-5">
      <div className="flex items-center">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="ml-2 mr-4 data-[orientation=vertical]:h-4"
        />
        <AppBreadcrumb />
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <User /> {user?.name}
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                setShowModalLogout(true);
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={showModalLogout} onOpenChange={setShowModalLogout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action will log you out of your account. Are you sure you
              want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleLogout}>
              Yes, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
