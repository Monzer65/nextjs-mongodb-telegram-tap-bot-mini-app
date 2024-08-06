"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type BalanceStore, createBalanceStore } from "@/stores/balance";

export type BalanceStoreApi = ReturnType<typeof createBalanceStore>;

export const BalanceStoreContext = createContext<BalanceStoreApi | undefined>(
  undefined
);

export interface BalanceStoreProviderProps {
  children: ReactNode;
}

export const BalanceStoreProvider = ({
  children,
}: BalanceStoreProviderProps) => {
  const storeRef = useRef<BalanceStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createBalanceStore();
  }

  return (
    <BalanceStoreContext.Provider value={storeRef.current}>
      {children}
    </BalanceStoreContext.Provider>
  );
};

export const useBalanceStore = <T,>(
  selector: (store: BalanceStore) => T
): T => {
  const balanceStoreContext = useContext(BalanceStoreContext);

  if (!balanceStoreContext) {
    throw new Error(`useBalanceStore must be used within BalanceStoreProvider`);
  }

  return useStore(balanceStoreContext, selector);
};
