"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  Eye,
  EyeOff,
  MoreHorizontal,
  Trash2,
  Search,
  Thermometer,
} from "lucide-react";

// Mock data based on user_history.json
const historyData = [
  {
    id: "checkup-003",
    date: "2024-08-23",
    data: {
      temperature: 36.9,
      bloodPressure: "118/78",
      heartRate: 72,
      respirationRate: 19,
      sleepHours: 8.0,
      mood: "Happy",
      activityLevel: "High",
      note: "Felt very energetic today.",
      photoUrl: null,
    },
    isPublic: false,
  },
  {
    id: "checkup-002",
    date: "2024-08-22",
    data: {
      temperature: 37.2,
      bloodPressure: "125/85",
      heartRate: 80,
      respirationRate: 20,
      sleepHours: 6.0,
      mood: "Stressed",
      activityLevel: "Low",
      note: "Felt a bit tired.",
      photoUrl: "https://ipfs.io/ipfs/examplehash/photo.png",
    },
    isPublic: true,
  },
  {
    id: "checkup-001",
    date: "2024-08-21",
    data: {
      temperature: 36.8,
      bloodPressure: "120/80",
      heartRate: 75,
      respirationRate: 18,
      sleepHours: 7.5,
      mood: "Normal",
      activityLevel: "Moderate",
      note: "No issues today.",
      photoUrl: null,
    },
    isPublic: false,
  },
];

interface CheckupRecord {
  id: string;
  date: string;
  data: {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    respirationRate: number;
    sleepHours: number;
    mood: string;
    activityLevel: string;
    note: string;
    photoUrl: string | null;
  };
  isPublic: boolean;
}

const moodEmojis: Record<string, string> = {
  Happy: "😊",
  Normal: "😐",
  Stressed: "😰",
  Sad: "😢",
  Sick: "🤒",
  Energetic: "⚡",
};

export function HistoryView() {
  const [records, setRecords] = useState<CheckupRecord[]>(historyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "public" | "private">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"date" | "mood" | "temperature">("date");

  const togglePrivacy = (id: string) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, isPublic: !record.isPublic } : record
      )
    );

    const record = records.find((r) => r.id === id);
    if (record) {
      alert(
        `Checkup ${record.isPublic ? "made private" : "published publicly"}! ${
          !record.isPublic ? "You earned 10 DHT tokens." : ""
        }`
      );
    }
  };

  const deleteRecord = (id: string) => {
    if (confirm("Are you sure you want to delete this checkup record?")) {
      setRecords((prev) => prev.filter((record) => record.id !== id));
    }
  };

  const filteredRecords = records
    .filter((record) => {
      if (filterType === "public") return record.isPublic;
      if (filterType === "private") return !record.isPublic;
      return true;
    })
    .filter(
      (record) =>
        record.data.mood.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.data.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.date.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === "date")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "temperature")
        return b.data.temperature - a.data.temperature;
      if (sortBy === "mood") return a.data.mood.localeCompare(b.data.mood);
      return 0;
    });

  const stats = {
    total: records.length,
    public: records.filter((r) => r.isPublic).length,
    private: records.filter((r) => !r.isPublic).length,
    avgTemperature:
      records.reduce((sum, r) => sum + r.data.temperature, 0) / records.length,
  };

  return (
    <div className="space-y-5 p-5">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Records</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
              {stats.total}
            </CardTitle>
            <CardAction className="bg-emerald-100/40 text-primary dark:bg-muted/50 p-3 rounded-lg">
              <Heart />
            </CardAction>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Public</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
              {stats.public}
            </CardTitle>
            <CardAction className="bg-emerald-100/40 text-primary dark:bg-muted/50 p-3 rounded-lg">
              <Eye />
            </CardAction>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Private</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
              {stats.private}
            </CardTitle>
            <CardAction className="bg-emerald-100/40 text-primary dark:bg-muted/50 p-3 rounded-lg">
              <EyeOff />
            </CardAction>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Avg Temperature</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
              {stats.avgTemperature.toFixed(1)}°C
            </CardTitle>
            <CardAction className="bg-emerald-100/40 text-primary dark:bg-muted/50 p-3 rounded-lg">
              <Thermometer />
            </CardAction>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
          <CardDescription>Find specific checkup records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by mood, notes, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select
              value={filterType}
              onValueChange={(value: "all" | "public" | "private") =>
                setFilterType(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="public">Public Only</SelectItem>
                <SelectItem value="private">Private Only</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: "date" | "mood" | "temperature") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Newest)</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="mood">Mood</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Heart className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No checkup records found
              </h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding your first health checkup"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <div className="flex flex-col md:flex-row items-start gap-2 md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-muted">
                      <Heart className="size-4 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <CardTitle className="text-primary font-semibold">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardTitle>
                      <CardDescription>ID: {record.id}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-between w-full md:w-auto">
                    <Badge variant={record.isPublic ? "default" : "secondary"}>
                      {record.isPublic ? (
                        <>
                          <Eye className="mr-1 h-3 w-3" />
                          Public
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1 h-3 w-3" />
                          Private
                        </>
                      )}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* <DropdownMenuItem
                          onClick={() =>
                            alert(
                              "Edit functionality would be implemented here"
                            )
                          }
                        >
                          <Edit className="size-4" />
                          Edit
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          onClick={() => togglePrivacy(record.id)}
                        >
                          {record.isPublic ? (
                            <>
                              <EyeOff className="size-4" />
                              Make Private
                            </>
                          ) : (
                            <>
                              <Eye className="size-4" />
                              Publish Public
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => deleteRecord(record.id)}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Vital Signs */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      VITAL SIGNS
                    </h4>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <strong>Temperature:</strong> {record.data.temperature}
                        °C
                      </p>
                      <p className="text-sm">
                        <strong>Blood Pressure:</strong>{" "}
                        {record.data.bloodPressure} mmHg
                      </p>
                      <p className="text-sm">
                        <strong>Heart Rate:</strong> {record.data.heartRate} BPM
                      </p>
                      {record.data.respirationRate && (
                        <p className="text-sm">
                          <strong>Respiration:</strong>{" "}
                          {record.data.respirationRate}/min
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Lifestyle */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      LIFESTYLE
                    </h4>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <strong>Mood:</strong>
                        <span className="ml-1">
                          {moodEmojis[record.data.mood]} {record.data.mood}
                        </span>
                      </p>
                      <p className="text-sm">
                        <strong>Activity:</strong> {record.data.activityLevel}
                      </p>
                      {record.data.sleepHours && (
                        <p className="text-sm">
                          <strong>Sleep:</strong> {record.data.sleepHours}h
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      NOTES
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {record.data.note || "No additional notes"}
                    </p>
                    {record.data.photoUrl && (
                      <p className="text-sm text-emerald-600">
                        📷 Photo attached
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
