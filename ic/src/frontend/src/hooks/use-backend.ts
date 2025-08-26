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
 * Custom hook untuk mengambil profil pengguna
 * @param principal - Principal ID pengguna
 * @returns Object dengan data, loading state, dan error
 */
export const useUserProfile = (principal: string) => {
  const service = useService(BACKEND_CANISTER_ID);
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!service || !principal) return;
      setLoading(true);
      try {
        const principalId = Principal.fromText(principal);
        const result = await service.get_user_profile(principalId);
        if ("Ok" in result) {
          setData(result.Ok);
        } else {
          setError(result.Err);
        }
      } catch (err: unknown) {
        console.log({ err });

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [service, principal]);

  return { data, loading, error };
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
