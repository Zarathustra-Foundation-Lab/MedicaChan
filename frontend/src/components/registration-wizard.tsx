"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Heart,
  FileText,
} from "lucide-react";

interface FormData {
  // Step 1: Basic Info
  fullName: string;
  age: string;
  gender: string;

  // Step 2: Physical Info
  height: string;
  weight: string;

  // Step 3: Medical History
  allergies: string;
  chronicDiseases: string;

  // Step 4: Review
}

const steps = [
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

export function RegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    allergies: "",
    chronicDiseases: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // In real app, this would submit to API
    console.log("Registration data:", formData);
    alert("Registration completed! (This is a mockup)");
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Complete Your Profile
                </CardTitle>
                <CardDescription>
                  Step {currentStep} of {steps.length}:{" "}
                  {steps[currentStep - 1].description}
                </CardDescription>
              </div>
              <Badge variant="outline">
                {currentStep}/{steps.length}
              </Badge>
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Steps Navigation */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div
                key={step.id}
                className={`flex flex-col items-center p-3 rounded-lg border ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : isCompleted
                    ? "border-green-200 bg-green-50"
                    : "border-muted"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                      ? "bg-green-500 text-white"
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

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {/* <steps[currentStep - 1].icon className="h-5 w-5" /> */}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age</label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gender</label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => updateFormData("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Physical Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Height (cm)</label>
                    <Input
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => updateFormData("height", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Weight (kg)</label>
                    <Input
                      type="number"
                      placeholder="65"
                      value={formData.weight}
                      onChange={(e) => updateFormData("weight", e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 This information helps provide personalized health
                    insights and recommendations.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Medical History */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Allergies (Optional)
                  </label>
                  <Textarea
                    placeholder="List any allergies you have (e.g., Peanuts, Shellfish, Pollen)"
                    value={formData.allergies}
                    onChange={(e) =>
                      updateFormData("allergies", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Chronic Diseases (Optional)
                  </label>
                  <Textarea
                    placeholder="List any chronic conditions (e.g., Diabetes, Hypertension, Asthma)"
                    value={formData.chronicDiseases}
                    onChange={(e) =>
                      updateFormData("chronicDiseases", e.target.value)
                    }
                  />
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-sm text-emerald-700">
                    🔒 Your medical information is private by default and only
                    shared if you choose to publish it.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Basic Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <strong>Name:</strong>{" "}
                        {formData.fullName || "Not provided"}
                      </p>
                      <p>
                        <strong>Age:</strong> {formData.age || "Not provided"}
                      </p>
                      <p>
                        <strong>Gender:</strong>{" "}
                        {formData.gender || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Physical Information</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <strong>Height:</strong>{" "}
                        {formData.height
                          ? `${formData.height} cm`
                          : "Not provided"}
                      </p>
                      <p>
                        <strong>Weight:</strong>{" "}
                        {formData.weight
                          ? `${formData.weight} kg`
                          : "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Medical History</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <strong>Allergies:</strong>{" "}
                        {formData.allergies || "None specified"}
                      </p>
                      <p>
                        <strong>Chronic Diseases:</strong>{" "}
                        {formData.chronicDiseases || "None specified"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Ready to create your profile! You can update this
                    information anytime in your dashboard.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
       
      </div>
    </div>
  );
}
