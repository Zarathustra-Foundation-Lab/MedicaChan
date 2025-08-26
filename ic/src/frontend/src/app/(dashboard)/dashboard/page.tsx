"use client";

import { TitleContent } from "@/components/title-content";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Summary from "./components/summary";
import RecentCheckup from "./components/recent-checkup";
import HealthInsight from "./components/health-insight";
import { useAuth } from "@/providers/auth-provider";
import { useUserProfile } from "../../../hooks/use-backend";
import { useEffect, useMemo } from "react";

/**
 * Halaman Dashboard utama yang menampilkan ringkasan data kesehatan pengguna
 * Mengintegrasikan data dari backend melalui useUserProfile hook
 */
export default function DashboardPage() {
  const router = useRouter();
  const { principal } = useAuth();
  const {
    data: userProfileData,
    loading,
    error,
  } = useUserProfile(principal?.toString() ?? "");

  // Transformasi data dari backend ke format yang dibutuhkan komponen dashboard
  const dashboardData = useMemo(() => {
    if (!userProfileData?.health_data) return null;

    const publicData = userProfileData.health_data.filter(
      (item) => item.is_public
    );
    const privateData = userProfileData.health_data.filter(
      (item) => !item.is_public
    );

    return {
      totalCheckups: userProfileData.health_data.length,
      publicCheckups: publicData.length,
      privateCheckups: privateData.length,
      totalRewards: Number(userProfileData.total_rewards),
      recentCheckups: userProfileData.health_data.slice(0, 3).map((item) => ({
        id: item.id,
        date: new Date(Number(item.date) * 1000).toISOString().split("T")[0],
        mood: item.data.mood,
        isPublic: item.is_public,
        temperature: item.data.temperature,
        bloodPressure: item.data.blood_pressure,
      })),
    };
  }, [userProfileData]);

  return (
    <div>
      <TitleContent
        title="Dashboard"
        description="Welcome back! Here's your health data overview."
        btnText="Add Checkup"
        btnOnClick={() => {
          router.push("/add-checkup");
        }}
        btnIcon={<Plus />}
      />
      <div className="p-5 space-y-5">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
                <div className="h-10 w-10 bg-muted rounded-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-destructive p-4 border border-destructive/20 rounded">
            Error loading data: {error}
          </div>
        ) : dashboardData ? (
          <>
            <Summary dashboardData={dashboardData} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RecentCheckup dashboardData={dashboardData} />
              <HealthInsight />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
