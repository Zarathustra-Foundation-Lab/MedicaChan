"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, FileText, Heart, User } from "lucide-react";
import { useState } from "react";
import ProgressHeader from "./components/progress-header";
import NavButton from "./components/nav-button";

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

  const progress = (currentStep / registerSteps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <ProgressHeader currentStep={currentStep} progress={progress} />

        <NavButton
          currentStep={currentStep}
          prevStep={() => setCurrentStep(currentStep - 1)}
          nextStep={() => setCurrentStep(currentStep + 1)}
          handleSubmit={() => {}}
        />
      </div>
    </div>
  );
}
