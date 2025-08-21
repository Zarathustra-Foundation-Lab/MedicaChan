import { DashboardLayout } from "@/components/dashboard-layout";
import { HistoryView } from "@/components/history-view";

export default function HistoryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health History</h1>
          <p className="text-muted-foreground">
            View and manage all your health checkup records.
          </p>
        </div>

        <HistoryView />
      </div>
    </DashboardLayout>
  );
}
