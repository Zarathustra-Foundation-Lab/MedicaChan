import { DashboardLayout } from "@/app/(dashboard)/old/components/dashboard-layout";
import { CheckupForm } from "@/app/(dashboard)/old/components/checkup-form";

export default function AddCheckupPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add Health Checkup
          </h1>
          <p className="text-muted-foreground">
            Record your daily health metrics and wellness indicators.
          </p>
        </div>

        <CheckupForm />
      </div>
    </DashboardLayout>
  );
}
