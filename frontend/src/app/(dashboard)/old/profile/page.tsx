import { DashboardLayout } from "@/components/dashboard-layout";
import { ProfileView } from "@/components/profile-view";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings.
          </p>
        </div>

        <ProfileView />
      </div>
    </DashboardLayout>
  );
}
