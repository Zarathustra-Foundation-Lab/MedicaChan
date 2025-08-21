import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRegistrationDataStore } from "../hooks/use-registration-data";
import NavButton from "./nav-button";
import { CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";

const ReviewConfirm = ({
  currentStep,
  prevStep,
}: {
  currentStep: number;
  prevStep: () => void;
}) => {
  const router = useRouter();

  const { data } = useRegistrationDataStore();

  const handleSubmit = () => {
    console.log(data);
    router.push("/");
  };

  return (
    <div className="space-y-4">
      <div className="grid border rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h4 className="font-semibold mb-2">Basic Information</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Name:</strong> {data.fullName || "Not provided"}
            </p>
            <p>
              <strong>Age:</strong> {data.age || "Not provided"}
            </p>
            <p>
              <strong>Gender:</strong> {data.gender || "Not provided"}
            </p>
          </div>
        </div>

        <div className="p-4 border-b">
          <h4 className="font-semibold mb-2">Physical Information</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Height:</strong>{" "}
              {data.height ? `${data.height} cm` : "Not provided"}
            </p>
            <p>
              <strong>Weight:</strong>{" "}
              {data.weight ? `${data.weight} kg` : "Not provided"}
            </p>
          </div>
        </div>

        <div className="p-4">
          <h4 className="font-semibold mb-2">Medical History</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Allergies:</strong> {data.allergies || "None specified"}
            </p>
            <p>
              <strong>Chronic Diseases:</strong>{" "}
              {data.chronicDiseases || "None specified"}
            </p>
          </div>
        </div>
      </div>
      <Alert variant="success">
        <CircleCheck />
        <AlertDescription className="font-semibold text-emerald-600">
          Ready to create your profile! You can update this information anytime
          in your dashboard.
        </AlertDescription>
      </Alert>
      <NavButton
        currentStep={currentStep}
        prevStep={prevStep}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default ReviewConfirm;
