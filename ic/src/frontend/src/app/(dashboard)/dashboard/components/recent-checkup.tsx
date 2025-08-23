import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DashboardData } from "@/types/dashboard-data-type";
import { Heart, Eye, EyeOff } from "lucide-react";

const RecentCheckup = ({ dashboardData }: { dashboardData: DashboardData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Checkups</CardTitle>
        <CardDescription>Your latest health data entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dashboardData.recentCheckups.map((checkup) => (
            <div key={checkup.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Heart className="size-4 text-primary" />
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
                <Badge variant={checkup.isPublic ? "default" : "secondary"}>
                  {checkup.isPublic ? (
                    <>
                      <Eye className="size-3" />
                      Public
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-3" />
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
  );
};

export default RecentCheckup;
