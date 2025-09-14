"use client";
import { AppConfig } from "@/config/app-config";
import { Heart } from "lucide-react";
import Image from "next/image";

export const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      {/* <Heart className="h-4 w-4 animate-pulse" /> */}
      <Image
        unoptimized
        src={"/medicachan-logo.png"}
        alt="logo"
        height={100}
        width={100}
        className="rounded-lg"
      />
    </div>
    <span className="font-semibold text-xl">{AppConfig.title}</span>
  </div>
);
