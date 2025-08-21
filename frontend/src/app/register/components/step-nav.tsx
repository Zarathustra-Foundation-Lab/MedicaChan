import { registerSteps } from "../page";

const StepNav = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="hidden md:grid grid-cols-4 gap-4">
      {registerSteps.map((step) => {
        const StepIcon = step.icon;
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;

        return (
          <div
            key={step.id}
            className={`flex flex-col items-center p-3 rounded-lg border ${
              isActive
                ? "border-primary bg-primary/10"
                : isCompleted
                ? "border-primary/50 bg-primary/5"
                : "border-muted"
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isCompleted
                  ? "bg-primary/50 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <StepIcon className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-center mt-2">
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StepNav;
