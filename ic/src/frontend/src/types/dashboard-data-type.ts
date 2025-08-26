interface DashboardData {
  totalCheckups: number;
  publicCheckups: number;
  privateCheckups: number;
  totalRewards: number;
  recentCheckups: CheckupData[];
}

interface CheckupData {
  id: string;
  date: string;
  mood: string;
  isPublic: boolean;
  temperature: number;
  bloodPressure: string;
}

export type { DashboardData, CheckupData };
