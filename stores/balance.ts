import { createStore } from "zustand/vanilla";

export type BalanceState = {
  totalCoins: number;
  coinsPerClick: number;
  currentEnergy: number;
  chargingSpeed: number;
  maxEnergyLevel: number;
  freeEnergyClicks: number;
  lastFreeEnergyTime: number;
  multitapCost: number;
  multitapLevel: number;
  rechargeSpeedCost: number;
  rechargeSpeedLevel: number;
  energyLimitCost: number;
  energyLimitLevel: number;
};

export type CounterActions = {
  decrementTotalCoins: (coins: number) => void;
  incrementTotalCoins: (coins: number) => void;
  incrementCoinsPerClick: (coins: number) => void;
  decrementCurrentEnergy: () => void;
  incrementCurrentEnergy: (coins: number) => void;
  incrementMaxEnergyLevel: (coins: number) => void;
  incrementChargingSpeed: () => void;

  incrementFreeEnergyClicks: () => void;
  setLastFreeEnergyTime: () => void;

  setMultitapCost: (cost: number) => void;
  setMultitapLevel: (level: number) => void;
  setRechargeSpeedCost: (cost: number) => void;
  setRechargeSpeedLevel: (level: number) => void;
  setEnergyLimitCost: (cost: number) => void;
  setEnergyLimitLevel: (level: number) => void;
};

export type CounterStore = BalanceState & CounterActions;

export const defaultInitState: BalanceState = {
  totalCoins: 0,
  coinsPerClick: 1,
  currentEnergy: 1,
  maxEnergyLevel: 500,
  chargingSpeed: 1,

  freeEnergyClicks: 0,
  lastFreeEnergyTime: Date.now() - 2 * 60 * 60 * 1000,

  multitapCost: 100,
  multitapLevel: 1,
  rechargeSpeedCost: 200,
  rechargeSpeedLevel: 1,
  energyLimitCost: 300,
  energyLimitLevel: 1,
};

export const createCounterStore = (
  initState: BalanceState = defaultInitState
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    decrementTotalCoins: (coins: number) =>
      set((state) => ({ totalCoins: state.totalCoins - coins })),
    incrementTotalCoins: (coins: number) =>
      set((state) => ({ totalCoins: state.totalCoins + coins })),
    incrementCoinsPerClick: (coins: number) =>
      set((state) => ({ coinsPerClick: state.coinsPerClick + coins })),
    decrementCurrentEnergy: () =>
      set((state) => ({
        currentEnergy: Math.max(0, state.currentEnergy - state.coinsPerClick),
      })),
    incrementCurrentEnergy: (coins: number) =>
      set((state) => ({
        currentEnergy: Math.min(
          state.maxEnergyLevel,
          state.currentEnergy + coins
        ),
      })),
    incrementMaxEnergyLevel: (coins: number) =>
      set((state) => ({ maxEnergyLevel: state.maxEnergyLevel + coins })),
    incrementChargingSpeed: () =>
      set((state) => ({
        chargingSpeed: Math.max(0, state.chargingSpeed * 1.05),
      })),

    incrementFreeEnergyClicks: () =>
      set((state) => ({ freeEnergyClicks: state.freeEnergyClicks + 1 })),
    setLastFreeEnergyTime: () =>
      set(() => ({ lastFreeEnergyTime: Date.now() })),
    setMultitapCost: (cost: number) => set(() => ({ multitapCost: cost })),
    setMultitapLevel: (level: number) => set(() => ({ multitapLevel: level })),
    setRechargeSpeedCost: (cost: number) =>
      set(() => ({ rechargeSpeedCost: cost })),
    setRechargeSpeedLevel: (level: number) =>
      set(() => ({ rechargeSpeedLevel: level })),
    setEnergyLimitCost: (cost: number) =>
      set(() => ({ energyLimitCost: cost })),
    setEnergyLimitLevel: (level: number) =>
      set(() => ({ energyLimitLevel: level })),
  }));
};
