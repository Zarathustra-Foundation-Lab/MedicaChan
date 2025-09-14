"use client";
import { Suspense } from "react";
import { TitleContent } from "@/components/title-content";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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

  const { data: userProfileData, loading: userProfileLoading } = useUserProfile(
    principal?.toString() ?? ""
  );

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
        <Suspense
          fallback={
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                </div>
              ))}
            </div>
          }
        >
          <DashboardMainContent />
        </Suspense>
      </div>
    </div>
  );
}

function DashboardMainContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { principal } = useAuth();

  const {
    data: userProfileData,
    loading,
    refetch,
  } = useUserProfile(principal?.toString() ?? "");

  // Trigger refetch saat navigasi terjadi
  useEffect(() => {
    const fetchData = async () => {
      if (principal) {
        await refetch();
      }
    };
    fetchData();
  }, [principal, searchParams, refetch]);

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
      recentCheckups: userProfileData.health_data.slice(0, 3).map((item) => {
        // Debug: Log data tanggal mentah untuk troubleshooting
        console.log(
          "Raw date value:",
          item.date,
          "Type:",
          typeof item.date,
          "Value of item.date:",
          item.date
        );

        // Handle BigInt secara eksplisit - ini adalah masalah utama
        let timestamp: number;
        if (typeof item.date === "bigint") {
          // Convert BigInt to number (in nanoseconds) and convert to milliseconds
          timestamp = Number(item.date) / 1_000_000;
        } else if (typeof item.date === "string") {
          timestamp = parseInt(item.date) / 1_000_000; // Asumsi dalam nanoseconds jika string
        } else {
          timestamp = Number(item.date) / 1_000_000; // Untuk number, asumsi nanoseconds
        }

        // Konversi dari nanoseconds ke milliseconds untuk Date object JavaScript
        const jsTimestamp = timestamp;

        console.log(
          "Converted timestamp:",
          jsTimestamp,
          "Is NaN:",
          isNaN(jsTimestamp)
        );

        let date = "Invalid Date";

        // Validasi dengan range yang lebih realistis untuk timestamp JavaScript
        if (
          !isNaN(jsTimestamp) &&
          jsTimestamp > 0 &&
          jsTimestamp < 8640000000000
        ) {
          // ~273.000 tahun
          try {
            // Konversi ke Date object dan format ke tanggal human-readable
            const dateObj = new Date(jsTimestamp);
            // Verifikasi objek Date valid sebelum format
            if (!isNaN(dateObj.getTime())) {
              date = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(dateObj);
            } else {
              console.log("Invalid Date object for timestamp:", jsTimestamp);
            }
          } catch (error) {
            console.error("Error formatting date:", error);
          }
        } else {
          console.log(
            "Invalid timestamp for item:",
            item.id,
            "value:",
            jsTimestamp
          );
        }

        return {
          id: item.id,
          date: date,
          mood: item.data.mood,
          isPublic: item.is_public,
          temperature: item.data.temperature,
          bloodPressure: item.data.blood_pressure,
        };
      }),
    };
  }, [userProfileData]);

  return (
    <>
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
      ) : dashboardData ? (
        <>
          <Summary dashboardData={dashboardData} />
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <RecentCheckup dashboardData={dashboardData} />
            {/* <HealthInsight /> */}
          </div>
        </>
      ) : null}
    </>
  );
}
