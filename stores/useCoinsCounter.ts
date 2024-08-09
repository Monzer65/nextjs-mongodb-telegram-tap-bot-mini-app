import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CountState = {
  counts: number;
};
export type CountAction = {
  addACount: () => void;
};
export type CountStore = CountState & CountAction;
export const useCoinsCount = create<CountStore>()(
  persist(
    (set, get) => ({
      counts: 0,
      addACount: () => set({ counts: get().counts + 1 }),
    }),
    {
      name: "coins-count",
    }
  )
);
