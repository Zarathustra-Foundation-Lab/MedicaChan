import { TitleContent } from "@/components/title-content";
import { HistoryView } from "./components/history-view";

export default function HistoryPage() {
  return (
    <div>
      <TitleContent
        title="History"
        description="View and manage all your health checkup records."
      />
      <HistoryView />
    </div>
  );
}
