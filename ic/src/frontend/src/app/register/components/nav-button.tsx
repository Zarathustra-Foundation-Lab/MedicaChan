import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { registerSteps } from "../page";

const NavButton = ({
  currentStep,
  prevStep,
  handleSubmit,
}: {
  currentStep: number;
  prevStep: () => void;
  handleSubmit?: () => void;
}) => {
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      {currentStep < registerSteps.length ? (
        <Button type="submit">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={handleSubmit}>
          <Check className="h-4 w-4" />
          Complete Registration
        </Button>
      )}
    </div>
  );
};

export default NavButton;
