"use client";

import { TitleContent } from "@/components/title-content";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Summary from "./components/summary";
import RecentCheckup from "./components/recent-checkup";
import HealthInsight from "./components/health-insight";
import { useAuth } from "@/providers/auth-provider";
import { useEffect } from "react";

// Mock data
const dashboardData = {
  totalCheckups: 15,
  publicCheckups: 8,
  privateCheckups: 7,
  totalRewards: 130,
  recentCheckups: [
    {
      id: "checkup-003",
      date: "2024-08-23",
      mood: "Happy",
      isPublic: false,
      temperature: 36.9,
      bloodPressure: "118/78",
    },
    {
      id: "checkup-002",
      date: "2024-08-22",
      mood: "Stressed",
      isPublic: true,
      temperature: 37.2,
      bloodPressure: "125/85",
    },
    {
      id: "checkup-001",
      date: "2024-08-21",
      mood: "Normal",
      isPublic: false,
      temperature: 36.8,
      bloodPressure: "120/80",
    },
  ],
};

export default function DashboardPage() {
  const router = useRouter();

  const { callFunction, principal } = useAuth();

  const getUserProfile = async () => {
    // const userProfile = await callFunction?.http_request({});
    // console.log(userProfile);
  };

  useEffect(() => {
    getUserProfile();
  }, []);

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
        <Summary dashboardData={dashboardData} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RecentCheckup dashboardData={dashboardData} />
          <HealthInsight />
        </div>
      </div>
    </div>
  );
}
