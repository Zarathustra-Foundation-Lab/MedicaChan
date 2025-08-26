"use client";

import { Check, FileText, Heart, User } from "lucide-react";
import { useState } from "react";
import ProgressHeader from "./components/progress-header";
import { FormBasicInfo } from "./components/form-basic-info";
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StepNav from "./components/step-nav";
import { FormPhysicalInfo } from "./components/form-physical-info";
import { FormMedicalHistory } from "./components/form-medical-history";
import ReviewConfirm from "./components/review-confirm";

export const registerSteps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Tell us about yourself",
    icon: User,
  },
  {
    id: 2,
    title: "Physical Information",
    description: "Your body measurements",
    icon: Heart,
  },
  {
    id: 3,
    title: "Medical History",
    description: "Important health information",
    icon: FileText,
  },
  {
    id: 4,
    title: "Review & Confirm",
    description: "Check your information",
    icon: Check,
  },
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < registerSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / registerSteps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <ProgressHeader currentStep={currentStep} progress={progress} />
        <StepNav currentStep={currentStep} />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {registerSteps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {registerSteps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStep === 1 && (
              <FormBasicInfo
                currentStep={currentStep}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            )}
            {currentStep === 2 && (
              <FormPhysicalInfo
                currentStep={currentStep}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            )}
            {currentStep === 3 && (
              <FormMedicalHistory
                currentStep={currentStep}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            )}
            {currentStep === 4 && (
              <ReviewConfirm currentStep={currentStep} prevStep={prevStep} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
