import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Coins, Eye, EyeOff } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Summary = ({ dashboardData }: { dashboardData: any }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Checkups</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
            {dashboardData.totalCheckups}
          </CardTitle>
          <CardAction className="bg-emerald-100/40 text-primary dark:bg-muted/50 p-3 rounded-lg">
            <Activity />
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm">
          +2 from last week
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Public Data</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
            {dashboardData.publicCheckups}
          </CardTitle>
          <CardAction className="bg-emerald-100/40 text-primary dark:bg-muted/50 p-3 rounded-lg">
            <Eye />
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm">
          Available for AI analysis
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Private Data</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
            {dashboardData.privateCheckups}
          </CardTitle>
          <CardAction className="bg-emerald-100/40 text-primary dark:bg-muted/50 p-3 rounded-lg">
            <EyeOff />
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm">
          Your eyes only
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>$MEDCN Rewards</CardDescription>
          <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
            {dashboardData.totalRewards}
          </CardTitle>
          <CardAction className="bg-emerald-100/40 text-primary dark:bg-muted/50 p-3 rounded-lg">
            <Coins />
          </CardAction>
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm">
          +10 from last publish
        </CardFooter>
      </Card>
    </div>
  );
};

export default Summary;
