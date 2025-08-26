import { TitleContent } from "@/components/title-content";
import { FormCheckup } from "./components/form-checkup";

export default function AddCheckupPage() {
  return (
    <div>
      <TitleContent
        title="Add Checkup"
        description="Record your daily health metrics and wellness indicators."
      />
      <FormCheckup  />
    </div>
  );
}
