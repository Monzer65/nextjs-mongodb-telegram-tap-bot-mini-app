import { atom } from "jotai";

export const userIdAtom = atom(null);
export const coinsAtom = atom(0);
export const maxEnergyAtom = atom(1000);
export const maxEnergyLevelAtom = atom(1);
export const maxEnergyCostAtom = atom(1000);
export const currentEnergyAtom = atom(900);
export const incrementByAtom = atom(1);
export const incrementByCostAtom = atom(500);
export const incrementSpeedAtom = atom(10);
export const incrementSpeedCostAtom = atom(500);

export const boostersAtom = atom([
  {
    name: "Free Energy",
    image: "/solar-energy.gif",
    maxLevels: 6,
    currentLevel: 1,
    cost: 0,
    disabled: false,
    isSaving: false,
  },
  {
    name: "Coins per Tap",
    image: "/tap-gesture.gif",
    maxLevels: 20,
    currentLevel: 1,
    cost: 500,
    disabled: false,
    isSaving: false,
  },
  {
    name: "Max Energy Limit",
    image: "/battery.gif",
    maxLevels: 20,
    currentLevel: 1,
    cost: 500,
    disabled: false,
    isSaving: false,
  },
  {
    name: "Recharge Speed",
    image: "/bolt.gif",
    maxLevels: 15,
    currentLevel: 1,
    cost: 3000,
    disabled: false,
    isSaving: false,
  },
]);

// Derived atoms for easier state management
export const currentBoosterLevelsAtom = atom((get) =>
  get(boostersAtom).map((booster) => booster.currentLevel)
);

export const currentBoosterCostsAtom = atom((get) =>
  get(boostersAtom).map((booster) => booster.cost)
);
