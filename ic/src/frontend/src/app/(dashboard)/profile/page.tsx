import { TitleContent } from "@/components/title-content";
import { ProfileView } from "./components/profile-view";

export default function ProfilePage() {
  return (
    <div>
      <TitleContent
        title="Profile"
        description="Manage your personal information and account settings."
      />
      <ProfileView />
    </div>
  );
}
