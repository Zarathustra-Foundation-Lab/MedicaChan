import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Heart, TrendingUp } from "lucide-react";

const HealthInsight = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Insights</CardTitle>
        <CardDescription>AI-powered analysis of your data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
              <TrendingUp className="h-4 w-4 text-rose-600" />
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
  );
};

export default HealthInsight;
