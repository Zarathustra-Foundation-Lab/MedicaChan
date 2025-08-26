import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRegistrationDataStore } from "../hooks/use-registration-data";
import NavButton from "./nav-button";
import { CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

import { useRegisterUser } from "../../../hooks/use-backend";

const ReviewConfirm = ({
  currentStep,
  prevStep,
}: {
  currentStep: number;
  prevStep: () => void;
}) => {
  const router = useRouter();
  const { principal } = useAuth();
  const { mutate: registerUser, loading, error } = useRegisterUser();
  const { data } = useRegistrationDataStore();

  /**
   * Menangani proses submit registrasi pengguna
   * Memanggil fungsi registerUser untuk menyimpan data pengguna ke backend
   * Menangani loading state, error, dan redirect setelah sukses
   */
  const handleSubmit = async () => {
    if (!principal) return;

    try {
      await registerUser(
        principal.toText(),
        data.fullName,
        parseInt(data.age),
        data.gender,
        data.weight ? parseFloat(data.weight) : undefined,
        data.height ? parseFloat(data.height) : undefined,
        data.chronicDiseases || undefined,
        data.allergies || undefined
      );
      // Redirect ke dashboard setelah registrasi berhasil
      router.push("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
      // Error akan ditampilkan melalui state error dari useRegisterUser
    }
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
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-red-600">{error}</AlertDescription>
        </Alert>
      )}
      <NavButton
        currentStep={currentStep}
        prevStep={prevStep}
        handleSubmit={handleSubmit}
        disabled={loading}
        buttonText={loading ? "Creating Profile..." : "Complete Registration"}
      />
    </div>
  );
};

export default ReviewConfirm;
