"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Camera,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  Heart,
  Lock,
  NotepadText,
  Save,
  Thermometer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAddCheckup } from "@/hooks/use-backend";
import { useAuth } from "@/providers/auth-provider";

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

const formSchema = z.object({
  temperature: z.string().min(1, {
    message: "Temperature is required",
  }),
  bloodPressureSystolic: z.string().min(1, {
    message: "Blood pressure systolic is required",
  }),
  bloodPressureDiastolic: z.string().min(1, {
    message: "Blood pressure diastolic is required",
  }),
  heartRate: z.string().min(1, {
    message: "Heart rate is required",
  }),
  respirationRate: z.string().optional(),
  sleepHours: z.string().optional(),
  mood: z.string().min(1, {
    message: "Mood is required",
  }),
  activityLevel: z.string().min(1, {
    message: "Activity level is required",
  }),
  notes: z.string().optional(),
  photoUrl: z.string().optional(),
});

export function FormCheckup() {
  const { principal } = useAuth();

  const [isPrivate, setIsPrivate] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });

  // Hook untuk menambahkan checkup baru ke backend
  const { mutate: addCheckup, loading, error } = useAddCheckup();

  // Fungsi untuk menangani submit form
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ principal });
    if (principal)
      try {
        // Mapping data form ke format HealthData sesuai dengan tipe yang diharapkan oleh backend
        const healthData = {
          temperature: parseFloat(values.temperature),
          blood_pressure: {
            systolic: parseInt(values.bloodPressureSystolic),
            diastolic: parseInt(values.bloodPressureDiastolic),
          },
          heart_rate: parseInt(values.heartRate),
          respiration_rate: values.respirationRate
            ? [parseInt(values.respirationRate)]
            : [0],
          sleep_hours: values.sleepHours
            ? [parseFloat(values.sleepHours)]
            : [0],
          mood: values.mood,
          activity_level: values.activityLevel,
          note: values.notes ? [values.notes] : [""], // Properti 'note' sesuai dengan tipe HealthData
          photo_url: values.photoUrl ? [values.photoUrl] : [""], // Mengikuti pola opsi [] | [string]
          timestamp: new Date().toISOString(),
          is_private: isPrivate,
        };

        // Dapatkan principal pengguna
        const userPrincipal = principal?.toString();

        // Panggil fungsi mutate untuk menambahkan checkup
        const res = await addCheckup(userPrincipal, {
          activity_level: [healthData.activity_level],
          blood_pressure: `${String(
            healthData.blood_pressure.diastolic
          )}/${String(healthData.blood_pressure.systolic)}`,
          heart_rate: healthData.heart_rate,
          mood: healthData.mood,
          note: healthData.note[0],
          photo_url: [healthData.photo_url[0]],
          sleep_hours: [healthData.sleep_hours[0]],
          respiration_rate: [healthData.respiration_rate[0]],
          temperature: healthData.temperature,
        });

        console.log({ res });

        // Reset form setelah submit berhasil
        form.reset();
      } catch (err) {
        console.error("Failed to submit checkup:", err);
        // Error akan ditangani oleh hook useAddCheckup
      }
  }

  return (
    <Form {...form}>
      <div className="p-5 space-y-5">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="size-5 text-rose-500" />
                <CardTitle>Daily Health Checkup</CardTitle>
              </div>
              <Badge variant="outline">{new Date().toLocaleDateString()}</Badge>
            </div>
            <CardDescription>
              Record your daily health metrics. All data is private by default.
            </CardDescription>
          </CardHeader>
        </Card>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {/* Vital Signs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="size-4 text-primary" />
                Vital Signs
              </CardTitle>
              <CardDescription>Essential health measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Temperature (°C)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="36.5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heartRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heart Rate (BPM)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="75" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormLabel>Blood Pressure</FormLabel>
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="bloodPressureSystolic"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="number" placeholder="120" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span className="text-muted-foreground">/</span>
                  <FormField
                    control={form.control}
                    name="bloodPressureDiastolic"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="number" placeholder="80" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span className="text-sm text-muted-foreground">mmHg</span>
                </div>
              </div>
              <FormField
                control={form.control}
                name="respirationRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Respiration Rate (Optional)
                      <span className="text-xs text-muted-foreground">
                        Breaths per minute
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="18" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Lifestyle Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                Lifestyle Factors
              </CardTitle>
              <CardDescription>
                Daily habits and wellness indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sleepHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Sleep Hours (Optional)
                        <span className="text-xs text-muted-foreground">
                          Hours of sleep
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.5"
                          placeholder="8.0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Level</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select activity level" />
                          </SelectTrigger>
                          <SelectContent>
                            {activityLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                <div className="flex items-center gap-2">
                                  <div className="font-medium">
                                    {level.label}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {level.description}
                                  </p>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mood</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NotepadText className="size-4 text-primary" />
                Additional Notes
              </CardTitle>
              <CardDescription>
                Any additional observations or symptoms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any symptoms, observations, or notes about your health today..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Photo (Coming Soon)</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {}}
                  className="w-full"
                  disabled
                >
                  <Camera className="size-4" />
                  Take Photo or Upload Image
                </Button>
                <p className="text-xs text-muted-foreground">
                  You can attach a photo of any relevant health indicators
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <>
            <Card className="opacity-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="size-4 text-primary" />
                  Privacy Settings (Coming Soon)
                </CardTitle>
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
                      <Eye className="h-5 w-5 text-primary" />
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
                    disabled
                    variant={isPrivate ? "outline" : "default"}
                    onClick={() => setIsPrivate(!isPrivate)}
                  >
                    {isPrivate ? "Make Public" : "Make Private"}
                  </Button>
                </div>
                {!isPrivate && (
                  <Alert className="mt-4" variant="success">
                    <DollarSign />
                    <AlertDescription className="font-semibold text-emerald-600">
                      Publishing this data will earn you 10 DHT tokens as a
                      reward for contributing to the health database.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Save className="size-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-4 mr-2" />
                    Save {isPrivate ? "Private" : "Public"} Checkup
                  </>
                )}
              </Button>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>Error: {error}</AlertDescription>
              </Alert>
            )}
          </>
        </form>
      </div>
    </Form>
  );
}
