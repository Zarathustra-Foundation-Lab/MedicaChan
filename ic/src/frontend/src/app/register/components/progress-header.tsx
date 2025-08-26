import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerSteps } from "../page";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ProgressHeader = ({
  currentStep,
  progress,
}: {
  currentStep: number;
  progress: number;
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>
              Step {currentStep} of {registerSteps.length}:{" "}
              {registerSteps[currentStep - 1].description}
            </CardDescription>
          </div>
          <Badge variant="outline">
            {currentStep}/{registerSteps.length}
          </Badge>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
    </Card>
  );
};

export default ProgressHeader;
