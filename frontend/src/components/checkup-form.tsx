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
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Thermometer,
  Camera,
  Save,
  Eye,
  EyeOff,
  Clock,
} from "lucide-react";

interface CheckupData {
  temperature: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  heartRate: string;
  respirationRate: string;
  sleepHours: string;
  mood: string;
  activityLevel: string;
  notes: string;
  photoUrl: string;
}

const moodOptions = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "normal", label: "Normal", emoji: "😐" },
  { value: "stressed", label: "Stressed", emoji: "😰" },
  { value: "sad", label: "Sad", emoji: "😢" },
  { value: "sick", label: "Sick", emoji: "🤒" },
  { value: "energetic", label: "Energetic", emoji: "⚡" },
];

const activityLevels = [
  { value: "low", label: "Low", description: "Minimal physical activity" },
  {
    value: "moderate",
    label: "Moderate",
    description: "Some walking or light exercise",
  },
  { value: "high", label: "High", description: "Regular exercise or sports" },
];

export function CheckupForm() {
  const [formData, setFormData] = useState<CheckupData>({
    temperature: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    respirationRate: "",
    sleepHours: "",
    mood: "",
    activityLevel: "",
    notes: "",
    photoUrl: "",
  });

  const [isPrivate, setIsPrivate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof CheckupData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Checkup data:", { ...formData, isPrivate });
      alert(
        `Checkup saved as ${isPrivate ? "private" : "public"}! ${
          !isPrivate ? "You'll receive 10 DHT tokens." : ""
        }`
      );
      setIsSubmitting(false);

      // Reset form
      setFormData({
        temperature: "",
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        heartRate: "",
        respirationRate: "",
        sleepHours: "",
        mood: "",
        activityLevel: "",
        notes: "",
        photoUrl: "",
      });
    }, 1000);
  };

  const handlePhotoCapture = () => {
    // In real app, this would open camera or file picker
    alert("Photo capture functionality would be implemented here");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <CardTitle>Daily Health Checkup</CardTitle>
            </div>
            <Badge variant="outline">{new Date().toLocaleDateString()}</Badge>
          </div>
          <CardDescription>
            Record your daily health metrics. All data is private by default.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Vital Signs
          </CardTitle>
          <CardDescription>Essential health measurements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Body Temperature (°C)
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="36.5"
                value={formData.temperature}
                onChange={(e) => updateFormData("temperature", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Heart Rate (BPM)</label>
              <Input
                type="number"
                placeholder="75"
                value={formData.heartRate}
                onChange={(e) => updateFormData("heartRate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Blood Pressure</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="120"
                value={formData.bloodPressureSystolic}
                onChange={(e) =>
                  updateFormData("bloodPressureSystolic", e.target.value)
                }
                required
              />
              <span className="text-muted-foreground">/</span>
              <Input
                type="number"
                placeholder="80"
                value={formData.bloodPressureDiastolic}
                onChange={(e) =>
                  updateFormData("bloodPressureDiastolic", e.target.value)
                }
                required
              />
              <span className="text-sm text-muted-foreground">mmHg</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Respiration Rate (Optional)
            </label>
            <Input
              type="number"
              placeholder="18"
              value={formData.respirationRate}
              onChange={(e) =>
                updateFormData("respirationRate", e.target.value)
              }
            />
            <p className="text-xs text-muted-foreground">Breaths per minute</p>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Lifestyle Factors
          </CardTitle>
          <CardDescription>
            Daily habits and wellness indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Sleep Hours (Optional)
              </label>
              <Input
                type="number"
                step="0.5"
                placeholder="8.0"
                value={formData.sleepHours}
                onChange={(e) => updateFormData("sleepHours", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Activity Level</label>
              <Select
                value={formData.activityLevel}
                onValueChange={(value) =>
                  updateFormData("activityLevel", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  {activityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {level.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mood</label>
            <Select
              value={formData.mood}
              onValueChange={(value) => updateFormData("mood", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="How are you feeling today?" />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    <div className="flex items-center gap-2">
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>
            Any additional observations or symptoms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea
              placeholder="Any symptoms, observations, or notes about your health today..."
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Photo (Optional)</label>
            <Button
              type="button"
              variant="outline"
              onClick={handlePhotoCapture}
              className="w-full"
            >
              <Camera className="mr-2 h-4 w-4" />
              Take Photo or Upload Image
            </Button>
            <p className="text-xs text-muted-foreground">
              You can attach a photo of any relevant health indicators
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>
            Control who can access your health data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {isPrivate ? (
                <EyeOff className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Eye className="h-5 w-5 text-green-600" />
              )}
              <div>
                <p className="font-medium">
                  {isPrivate ? "Private Data" : "Public Data"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isPrivate
                    ? "Only you can see this data"
                    : "Data will be available for AI analysis and you'll earn 10 DHT tokens"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant={isPrivate ? "outline" : "default"}
              onClick={() => setIsPrivate(!isPrivate)}
            >
              {isPrivate ? "Make Public" : "Make Private"}
            </Button>
          </div>

          {!isPrivate && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                💰 Publishing this data will earn you 10 DHT tokens as a reward
                for contributing to the health database.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Save as Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting
            ? "Saving..."
            : `Save ${isPrivate ? "Private" : "Public"} Checkup`}
        </Button>
      </div>
    </form>
  );
}
