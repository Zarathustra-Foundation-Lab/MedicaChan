import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Heart,
  Plus,
  TrendingUp,
  Calendar,
  Eye,
  EyeOff,
  Coins,
} from "lucide-react";

// Mock data - in real app this would come from API/state management
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

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s your health data overview.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Checkup
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Checkups
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.totalCheckups}
              </div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Public Data</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.publicCheckups}
              </div>
              <p className="text-xs text-muted-foreground">
                Available for AI analysis
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Private Data
              </CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.privateCheckups}
              </div>
              <p className="text-xs text-muted-foreground">Your eyes only</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">DHT Rewards</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.totalRewards}
              </div>
              <p className="text-xs text-muted-foreground">
                +10 from last publish
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Checkups</CardTitle>
              <CardDescription>Your latest health data entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentCheckups.map((checkup) => (
                  <div
                    key={checkup.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Heart className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {checkup.date}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Mood: {checkup.mood} • {checkup.temperature}°C •{" "}
                          {checkup.bloodPressure}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={checkup.isPublic ? "default" : "secondary"}
                      >
                        {checkup.isPublic ? (
                          <>
                            <Eye className="mr-1 h-3 w-3" />
                            Public
                          </>
                        ) : (
                          <>
                            <EyeOff className="mr-1 h-3 w-3" />
                            Private
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Health Insights</CardTitle>
              <CardDescription>
                AI-powered analysis of your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Blood Pressure Trend</p>
                    <p className="text-sm text-muted-foreground">
                      Stable within healthy range
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <Activity className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Activity Pattern</p>
                    <p className="text-sm text-muted-foreground">
                      Consistent daily entries
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <Heart className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mood Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Generally positive trend
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and next steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Today&apos;s Checkup
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View History
              </Button>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Publish Data
              </Button>
              <Button variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
