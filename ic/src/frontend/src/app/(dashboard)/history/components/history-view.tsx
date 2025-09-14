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
  Search,
  Thermometer,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useGetUserHistory } from "@/hooks/use-backend";
import { usePublishCheckup } from "@/hooks/use-backend";

const moodEmojis: Record<string, string> = {
  Happy: "😊",
  Normal: "😐",
  Stressed: "😰",
  Sad: "😢",
  Sick: "🤒",
  Energetic: "⚡",
};

// Konversi BigInt timestamp (nanodetik) ke format tanggal yang dapat dibaca
const formatTimestamp = (timestamp: bigint | number | string): string => {
  // Konversi ke number dalam milidetik
  let timestampMs: number;
  if (typeof timestamp === "bigint") {
    timestampMs = Number(timestamp) / 1_000_000; // nanodetik ke milidetik
  } else if (typeof timestamp === "string") {
    timestampMs = parseInt(timestamp) / 1_000_000;
  } else {
    timestampMs = timestamp / 1_000_000;
  }

  // Validasi dan format
  if (!isNaN(timestampMs) && timestampMs > 0 && timestampMs < 8640000000000) {
    try {
      const dateObj = new Date(timestampMs);
      if (!isNaN(dateObj.getTime())) {
        return new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(dateObj);
      }
    } catch (error) {
      console.error("Error formatting date:", error);
    }
  }
  return "Invalid Date";
};

export function HistoryView() {
  const { principal } = useAuth();
  const {
    data: historyData,
    loading,
    error,
    refetch: refetchHistory,
  } = useGetUserHistory(principal?.toString() ?? "");
  const { mutate: publishCheckup, loading: publishing } = usePublishCheckup();

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "public" | "private">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"date" | "mood" | "temperature">("date");

  const togglePrivacy = async (id: string) => {
    if (!principal) return;

    try {
      await publishCheckup(principal.toString(), id);
      // Refetch data setelah publish/unpublish
      refetchHistory();
    } catch (error) {
      console.error("Failed to toggle privacy:", error);
    }
  };

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="space-y-5 p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="h-10 w-10 bg-muted rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Tampilkan error jika ada
  if (error) {
    return (
      <div className="p-5">
        <div className="text-destructive p-4 border border-destructive/20 rounded">
          Error loading data: {error}
        </div>
      </div>
    );
  }

  // Pastikan data ada
  if (!historyData || historyData.length === 0) {
    return (
      <div className="space-y-5 p-5">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Heart className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">No health data found</h3>
            <p className="text-muted-foreground text-center">
              No health checkup records found for this user
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter dan sort data
  const filteredRecords = historyData
    .filter((record) => {
      // Filter berdasarkan tipe
      const typeMatch =
        filterType === "all" ||
        (filterType === "public" && record.is_public) ||
        (filterType === "private" && !record.is_public);

      // Filter berdasarkan pencarian
      const searchLower = searchTerm.toLowerCase();
      const searchMatch =
        !searchTerm ||
        record.data.mood.toLowerCase().includes(searchLower) ||
        record.data.note.toLowerCase().includes(searchLower) ||
        formatTimestamp(record.date).toLowerCase().includes(searchLower);

      return typeMatch && searchMatch;
    })
    .sort((a, b) => {
      // Sortir berdasarkan kriteria pilihan
      if (sortBy === "date") {
        const aTime =
          typeof a.date === "bigint"
            ? Number(a.date) / 1_000_000
            : Number(a.date) / 1_000_000;
        const bTime =
          typeof b.date === "bigint"
            ? Number(b.date) / 1_000_000
            : Number(b.date) / 1_000_000;
        return bTime - aTime; // Newest first
      }

      if (sortBy === "temperature") {
        return b.data.temperature - a.data.temperature;
      }

      if (sortBy === "mood") {
        return a.data.mood.localeCompare(b.data.mood);
      }

      return 0;
    });

  // Hitung statistik
  const stats = {
    total: filteredRecords.length,
    public: filteredRecords.filter((r) => r.is_public).length,
    private: filteredRecords.filter((r) => !r.is_public).length,
    avgTemperature:
      filteredRecords.length > 0
        ? filteredRecords.reduce((sum, r) => sum + r.data.temperature, 0) /
          filteredRecords.length
        : 0,
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
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "No records match your filters"}
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
                        {formatTimestamp(record.date)}
                      </CardTitle>
                      <CardDescription>ID: {record.id}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-between w-full md:w-auto">
                    <Badge variant={record.is_public ? "default" : "secondary"}>
                      {record.is_public ? (
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
                    {!record.is_public && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Disable toggle privacy saat publishing */}
                          <DropdownMenuItem
                            onClick={() => togglePrivacy(record.id)}
                            disabled={publishing}
                          >
                            {!record.is_public && (
                              <>
                                <Eye className="size-4" />
                                Publish Public
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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
                        {record.data.blood_pressure} mmHg
                      </p>
                      <p className="text-sm">
                        <strong>Heart Rate:</strong> {record.data.heart_rate}{" "}
                        BPM
                      </p>
                      {record.data.respiration_rate && (
                        <p className="text-sm">
                          <strong>Respiration:</strong>{" "}
                          {record.data.respiration_rate}/min
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
                        <strong>Activity:</strong> {record.data.activity_level}
                      </p>
                      {record.data.sleep_hours && (
                        <p className="text-sm">
                          <strong>Sleep:</strong> {record.data.sleep_hours}h
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
                    {record.data.photo_url && (
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
