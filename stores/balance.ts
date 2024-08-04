import { createStore } from "zustand/vanilla";

export type CounterState = {
  count: number;
  coinsPerClick: number;
  currentEnergy: number;
  maxEnergyLevel: number;
};

export type CounterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
  decrementCoinsPerClick: () => void;
  incrementCoinsPerClick: () => void;
  decrementCurrentEnergy: () => void;
  incrementCurrentEnergy: () => void;
  decrementMaxEnergy: () => void;
  incrementMaxEnergy: () => void;
};

export type CounterStore = CounterState & CounterActions;

export const defaultInitState: CounterState = {
  count: 0,
  coinsPerClick: 1,
  currentEnergy: 1,
  maxEnergyLevel: 500,
};

export const createCounterStore = (
  initState: CounterState = defaultInitState
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
    decrementCoinsPerClick: () =>
      set((state) => ({ coinsPerClick: state.coinsPerClick - 1 })),
    incrementCoinsPerClick: () =>
      set((state) => ({ coinsPerClick: state.coinsPerClick + 1 })),
    decrementCurrentEnergy: () =>
      set((state) => ({ currentEnergy: state.currentEnergy - 1 })),
    incrementCurrentEnergy: () =>
      set((state) => ({ currentEnergy: state.currentEnergy + 1 })),
    decrementMaxEnergy: () =>
      set((state) => ({ maxEnergyLevel: state.maxEnergyLevel - 1 })),
    incrementMaxEnergy: () =>
      set((state) => ({ maxEnergyLevel: state.maxEnergyLevel + 1 })),
  }));
};
