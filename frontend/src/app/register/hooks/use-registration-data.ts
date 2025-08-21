import { create } from "zustand";

export interface RegistrationData {
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
}

interface RegistrationDataStore {
  data: RegistrationData;
  updateData: (data: Partial<RegistrationData>) => void;
}

export const useRegistrationDataStore = create<RegistrationDataStore>(
  (set) => ({
    data: {
      fullName: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      allergies: "",
      chronicDiseases: "",
    },
    updateData: (data) =>
      set((state) => ({ data: { ...state.data, ...data } })),
  })
);
