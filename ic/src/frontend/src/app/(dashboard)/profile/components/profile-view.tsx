"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useUpdateProfile,
  useUserProfile,
  useGetUserHistory,
} from "@/hooks/use-backend";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Edit,
  Save,
  Coins,
  Award,
  Calendar,
  Activity,
  Heart,
  Shield,
  Camera,
  Lightbulb,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/providers/auth-provider";

// Mock data based on user_profile.json
const initialUserData = {
  id: "principal-12345",
  fullName: "John Doe",
  age: 22,
  gender: "Male",
  heightCm: 175.0,
  weightKg: 65.0,
  allergies: "Peanuts",
  chronicDiseases: "Asthma",
  totalRewards: 120,
  avatar: "/avatars/01.png",
  email: "john.doe@example.com",
  joinDate: "2024-08-01",
  publicDataCount: 8,
  privateDataCount: 7,
};

interface UserProfile {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  heightCm?: number;
  weightKg?: number;
  allergies?: string;
  chronicDiseases?: string;
  totalRewards: number;
  avatar: string;
  email: string;
  joinDate: string;
  publicDataCount: number;
  privateDataCount: number;
}

export function ProfileView() {
  const { principal } = useAuth();
  const { mutate: updateProfile, loading: isUpdating } = useUpdateProfile();
  const { refetch: refetchProfile, data: userDefaultData } = useUserProfile(
    principal?.toString() || ""
  );

  const { data: userHistoryCheckup } = useGetUserHistory(
    principal?.toString() || ""
  );

  // State untuk menyimpan data yang sedang diedit
  const [editData, setEditData] = useState<UserProfile>({
    id: initialUserData.id,
    fullName: initialUserData.fullName,
    age: initialUserData.age,
    gender: initialUserData.gender,
    heightCm: initialUserData.heightCm,
    weightKg: initialUserData.weightKg,
    allergies: initialUserData.allergies,
    chronicDiseases: initialUserData.chronicDiseases,
    totalRewards: initialUserData.totalRewards,
    avatar: initialUserData.avatar,
    email: initialUserData.email,
    joinDate: initialUserData.joinDate,
    publicDataCount: initialUserData.publicDataCount,
    privateDataCount: initialUserData.privateDataCount,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sinkronisasi editData dengan userDefaultData saat data dari backend diperbarui
  useEffect(() => {
    if (userDefaultData) {
      setEditData((prev) => ({
        ...prev,
        fullName: userDefaultData.full_name,
        age: userDefaultData.age,
        gender: userDefaultData.gender,
        heightCm: userDefaultData.height_cm
          ? userDefaultData.height_cm[0]
          : undefined,
        weightKg: userDefaultData.weight_kg
          ? userDefaultData.weight_kg[0]
          : undefined,
        allergies: userDefaultData.allergies
          ? userDefaultData.allergies[0]
          : undefined,
        chronicDiseases: userDefaultData.chronic_diseases
          ? userDefaultData.chronic_diseases[0]
          : undefined,
      }));
    }
  }, [userDefaultData]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await updateProfile(
        principal?.toString() || "",
        editData.fullName,
        editData.age || 0,
        editData.gender,
        editData.heightCm,
        editData.weightKg,
        editData.allergies,
        editData.chronicDiseases
      );

      // Refetch profile to ensure we have latest data
      await refetchProfile();

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset editData to match the current userDefaultData
    if (userDefaultData) {
      setEditData((prev) => ({
        ...prev,
        fullName: userDefaultData.full_name,
        age: userDefaultData.age,
        gender: userDefaultData.gender,
        heightCm: userDefaultData.height_cm
          ? userDefaultData.height_cm[0]
          : undefined,
        weightKg: userDefaultData.weight_kg
          ? userDefaultData.weight_kg[0]
          : undefined,
        allergies: userDefaultData.allergies
          ? userDefaultData.allergies[0]
          : undefined,
        chronicDiseases: userDefaultData.chronic_diseases
          ? userDefaultData.chronic_diseases[0]
          : undefined,
      }));
    }
  };

  const calculateBMI = () => {
    const heightInMeters = Number(userDefaultData?.height_cm) / 100;
    return (
      Number(userDefaultData?.weight_kg) /
      (heightInMeters * heightInMeters)
    ).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5)
      return { category: "Underweight", color: "text-emerald-600" };
    if (bmi < 25) return { category: "Normal", color: "text-green-600" };
    if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" };
    return { category: "Obese", color: "text-red-600" };
  };

  const bmi = parseFloat(calculateBMI());
  const bmiInfo = getBMICategory(bmi);

  return (
    <div className="space-y-5 p-5">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={editData.avatar}
                  alt={userDefaultData?.full_name}
                />
                <AvatarFallback className="text-lg">
                  {userDefaultData?.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 items-center md:items-start">
                <CardTitle className="text-2xl">
                  {userDefaultData?.full_name}
                </CardTitle>
                <CardDescription className="text-base opacity-50">
                  email (soon)
                </CardDescription>
                <div className="flex items-center flex-col md:flex-row gap-2 mt-2">
                  <Badge variant="secondary">
                    <Shield className="h-3 w-3" />
                    Principal: {principal?.toString().slice(0, 20) + "..."}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button disabled variant="outline">
                <Camera className="h-4 w-4" />
                Change Photo (soon)
              </Button>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-4 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Your personal details and demographics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                {isEditing ? (
                  <Input
                    value={editData.fullName}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {userDefaultData?.full_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Age</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.age}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        age: parseInt(e.target.value),
                      }))
                    }
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {userDefaultData?.age} years old
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                {isEditing ? (
                  <Select
                    value={editData.gender}
                    defaultValue={editData.gender}
                    onValueChange={(value) =>
                      setEditData((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {userDefaultData?.gender}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              Physical Information
            </CardTitle>
            <CardDescription>
              Body measurements and health metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Height (cm)</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.heightCm || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        heightCm: parseFloat(e.target.value),
                      }))
                    }
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {userDefaultData?.height_cm
                      ? userDefaultData.height_cm[0]
                      : "N/A"}{" "}
                    cm
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Weight (kg)</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.weightKg || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        weightKg: parseFloat(e.target.value),
                      }))
                    }
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {userDefaultData?.weight_kg
                      ? userDefaultData.weight_kg[0]
                      : "N/A"}{" "}
                    kg
                  </p>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">BMI</p>
                    <p className="text-lg font-bold">{calculateBMI()}</p>
                  </div>
                  <Badge variant="outline" className={bmiInfo.color}>
                    {bmiInfo.category}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medical History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="size-4 text-primary" />
              Medical History
            </CardTitle>
            <CardDescription>
              Important health conditions and allergies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Allergies</label>
              {isEditing ? (
                <Textarea
                  value={editData.allergies || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      allergies: e.target.value,
                    }))
                  }
                  placeholder="List any allergies..."
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {userDefaultData?.allergies
                    ? userDefaultData.allergies[0]
                    : "No known allergies"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Chronic Diseases</label>
              {isEditing ? (
                <Textarea
                  value={editData.chronicDiseases || ""}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      chronicDiseases: e.target.value,
                    }))
                  }
                  placeholder="List any chronic conditions..."
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {userDefaultData?.chronic_diseases
                    ? userDefaultData.chronic_diseases[0]
                    : "No chronic conditions"}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rewards & Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="size-4 text-primary" />
              Rewards & Activity
            </CardTitle>
            <CardDescription>
              Your contributions and earned rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <Coins className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-700">
                  {userDefaultData?.total_rewards.toString()}
                </p>
                <p className="text-sm text-yellow-600">$MEDCN Tokens</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">
                  {userHistoryCheckup?.filter((checkup) => checkup.is_public)
                    .length || 0}
                </p>
                <p className="text-sm text-green-600">Public Checkups</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Public Data Shared</span>
                <span>
                  {userHistoryCheckup?.filter((checkup) => checkup.is_public)
                    .length || 0}{" "}
                  checkups
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Private Data Stored</span>
                <span>
                  {" "}
                  {userHistoryCheckup?.filter((checkup) => !checkup.is_public)
                    .length || 0}{" "}
                  checkups
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Total Contributions</span>
                <span>{userHistoryCheckup?.length || 0} checkups</span>
              </div>
            </div>
            <Alert className="mt-4" variant="success">
              <Lightbulb />
              <AlertDescription className="font-semibold text-emerald-600">
                Share more health data publicly to earn additional $MEDCN tokens
                and contribute to AI health research.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Settings (soon feature) */}
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            Privacy & Security (soon)
          </CardTitle>
          <CardDescription>
            Manage your data privacy preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Profile Visibility</p>
                <p className="text-sm text-muted-foreground">
                  Control who can see your basic profile information
                </p>
              </div>
              <Select disabled defaultValue="private">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="research">Research Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Data Export</p>
                <p className="text-sm text-muted-foreground">
                  Download all your health data
                </p>
              </div>
              <Button disabled variant="outline">
                Export Data
              </Button>
            </div>

            <div className="flex items-center justify-between gap-4 p-4 border rounded-lg">
              <div>
                <p className="font-medium">Account Deletion</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button disabled variant="destructive">
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
