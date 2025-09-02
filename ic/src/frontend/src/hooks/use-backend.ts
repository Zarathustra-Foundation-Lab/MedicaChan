import { useState, useEffect, useCallback } from "react";
import { useService } from "./service";
import type {
  // _SERVICE,
  HealthData,
  HealthCheckup,
  User,
} from "../../../declarations/backend/backend.did.d";
import { Principal } from "@dfinity/principal";

// Tipe untuk hasil operasi
// type Result<T> = { Ok: T } | { Err: string };

const BACKEND_CANISTER_ID =
  process.env.NEXT_PUBLIC_BACKEND_CANISTER_ID || "u6s2n-gx777-77774-qaaba-cai";

/**
 * Custom hook untuk mengambil profil pengguna dengan retry otomatis
 * @param principal - Principal ID pengguna
 * @returns Object dengan data, loading state, dan fungsi refetch
 */
export const useUserProfile = (principal: string) => {
  const service = useService(BACKEND_CANISTER_ID);
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!service || !principal) return;
    
    // Jangan set error di state, karena ingin menyembunyikannya dari UI
    setLoading(true);
    
    // Konfigurasi retry
    const maxRetries = 3;
    const baseDelay = 1000; // 1 detik
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const principalId = Principal.fromText(principal);
        const result = await service.get_user_profile(principalId);
        
        if ("Ok" in result) {
          setData(result.Ok);
          setLoading(false);
          return; // Berhasil, keluar dari fungsi
        }
        
        // Jika gagal dengan error dari backend, catat di console tapi jangan set ke state
        console.warn(`Attempt ${attempt} failed with backend error:`, result.Err);
        
      } catch (err: unknown) {
        console.log({ attempt, err });
        
        // Jika ini bukan retry terakhir, tunggu sebelum mencoba lagi
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt - 1); // exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // Jika semua retry gagal, catat error tapi jangan set ke state
        if (err instanceof Error) {
          console.error("Final fetch failed after retries:", err.message);
        } else {
          console.error("Final fetch failed after retries with unknown error");
        }
      }
    }
    
    // Setelah semua retry gagal, set loading ke false tapi jangan set error
    setLoading(false);
  }, [service, principal]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { data, loading, refetch: fetchProfile };
};

/**
 * Custom hook untuk menambahkan checkup baru
 * @returns Fungsi mutate dan state loading & error
 */
export const useAddCheckup = () => {
  const service = useService(BACKEND_CANISTER_ID);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (principal: string, healthData: HealthData) => {
      if (!service) throw new Error("Service not initialized");
      setLoading(true);
      try {
        const principalId = Principal.fromText(principal);
        const result = await service.add_checkup(principalId, healthData);
        if ("Ok" in result) {
          return result.Ok;
        } else {
          setError(result.Err);
          throw new Error(result.Err);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  return { mutate, loading, error };
};

/**
 * Custom hook untuk mengambil data pribadi pengguna
 * @param principal - Principal ID pengguna
 * @returns Object dengan data, loading state, dan error
 */
export const useGetPrivateData = (principal: string) => {
  const service = useService(BACKEND_CANISTER_ID);
  const [data, setData] = useState<HealthCheckup[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivateData = async () => {
      if (!service || !principal) return;
      setLoading(true);
      try {
        const principalId = Principal.fromText(principal);
        const result = await service.get_private_data(principalId);
        if ("Ok" in result) {
          setData(result.Ok);
        } else {
          setError(result.Err);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrivateData();
  }, [service, principal]);

  return { data, loading, error };
};

/**
 * Custom hook untuk mengambil data publik
 * @returns Object dengan data, loading state, dan error
 */
export const useGetPublicData = () => {
  const BACKEND_CANISTER_ID =
    process.env.NEXT_PUBLIC_BACKEND_CANISTER_ID ||
    "uxrrr-q7777-77774-qaaaq-cai";

  const service = useService(BACKEND_CANISTER_ID);
  const [data, setData] = useState<HealthCheckup[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicData = async () => {
      if (!service) return;
      setLoading(true);
      try {
        const result = await service.get_public_data();
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [service]);

  return { data, loading, error };
};

/**
 * Custom hook untuk mempublikasikan checkup
 * @returns Fungsi mutate dan state loading & error
 */
export const usePublishCheckup = () => {
  const service = useService(BACKEND_CANISTER_ID);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (principal: string, checkupId: string) => {
      if (!service) throw new Error("Service not initialized");
      setLoading(true);
      try {
        const principalId = Principal.fromText(principal);
        const result = await service.publish_checkup(principalId, checkupId);
        if ("Ok" in result) {
          return result.Ok;
        } else {
          setError(result.Err);
          throw new Error(result.Err);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  return { mutate, loading, error };
};

/**
 * Custom hook untuk registrasi pengguna baru
 * @returns Fungsi mutate dan state loading & error
 */
export const useRegisterUser = () => {
  console.log(BACKEND_CANISTER_ID);

  const service = useService(BACKEND_CANISTER_ID);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (
      principal: string,
      fullName: string,
      age: number,
      gender: string,
      weightKg?: number,
      heightCm?: number,
      chronicDiseases?: string,
      allergies?: string
    ) => {
      if (!service) throw new Error("Service not initialized");
      setLoading(true);
      try {
        const principalId = Principal.fromText(principal);
        const result = await service.register_user(
          principalId,
          fullName,
          age,
          gender,
          weightKg !== undefined ? [weightKg] : [],
          heightCm !== undefined ? [heightCm] : [],
          chronicDiseases !== undefined ? [chronicDiseases] : [],
          allergies !== undefined ? [allergies] : []
        );

        console.log({ result });

        if ("Ok" in result) {
          return result.Ok;
        } else {
          setError(result.Err);
          throw new Error(result.Err);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service]
  );

  return { mutate, loading, error };
};

/**
 * Custom hook untuk mengambil histori checkup pengguna
 * @param principal - Principal ID pengguna
 * @returns Object dengan data, loading state, error, dan fungsi refetch
 */
export const useGetUserHistory = (principal: string) => {
  const service = useService(BACKEND_CANISTER_ID);
  const [data, setData] = useState<HealthCheckup[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!service || !principal) return;
    
    setLoading(true);
    
    // Konfigurasi retry
    const maxRetries = 3;
    const baseDelay = 1000; // 1 detik
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const principalId = Principal.fromText(principal);
        const result = await service.get_user_history(principalId);
        
        if ("Ok" in result) {
          setData(result.Ok);
          setLoading(false);
          return; // Berhasil, keluar dari fungsi
        }
        
        // Jika gagal dengan error dari backend, catat di console tapi jangan set ke state
        console.warn(`Attempt ${attempt} failed with backend error:`, result.Err);
        
      } catch (err: unknown) {
        console.log({ attempt, err });
        
        // Jika ini bukan retry terakhir, tunggu sebelum mencoba lagi
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt - 1); // exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // Jika semua retry gagal, catat error tapi jangan set ke state
        if (err instanceof Error) {
          console.error("Final fetch failed after retries:", err.message);
          setError(err.message);
        } else {
          console.error("Final fetch failed after retries with unknown error");
          setError("An unknown error occurred");
        }
      }
    }
    
    // Setelah semua retry gagal, set loading ke false
    setLoading(false);
  }, [service, principal]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { data, loading, error, refetch: fetchHistory };
};
