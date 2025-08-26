import { useMemo } from "react";
import { HttpAgent } from "@dfinity/agent";
import { _SERVICE } from "../../../declarations/backend/backend.did";
import { createActor } from "../../../declarations/backend";

/**
 * Hook untuk membuat actor service dengan konfigurasi jaringan yang sesuai
 * Mengikuti pendekatan DFX_NETWORK seperti di auth-provider.tsx
 *
 * @param canisterId - ID canister yang akan diakses
 * @param agentOptions - Opsi tambahan untuk konfigurasi agent
 * @returns ActorSubclass<_SERVICE> yang siap digunakan
 */
export const useService = (
  canisterId: string = "uqqxf-5h777-77774-qaaaa-cai",
  agentOptions?: Record<string, unknown>
) => {
  return useMemo(() => {
    // Tentukan host berdasarkan jaringan
    const host =
      process.env.DFX_NETWORK === "ic"
        ? "https://ic0.app" // Mainnet
        : "http://127.0.0.1:4943"; // Localnet

    // Buat agent dengan konfigurasi yang sesuai
    const agent = new HttpAgent({
      host,
      ...agentOptions,
    });

    // Ambil root key hanya di lingkungan non-mainnet
    if (process.env.DFX_NETWORK !== "ic") {
      agent.fetchRootKey().catch((err) => {
        console.warn("Failed to fetch root key:", err);
      });
    }

    return createActor(canisterId, {
      agent,
    });
  }, [canisterId, agentOptions]);
};
