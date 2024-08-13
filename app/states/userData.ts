"use client";
import { ObjectId } from "mongodb";
import { createGlobalState } from ".";

type TUserData = {
  // _id: ObjectId;
  userId: number;
  coins: number;
  incrementBy: number;
  incrementByCost: number;
  incrementSpeed: number;
  incrementSpeedCost: number;
  maxEnergy: number;
  maxEnergyCost: number;
  maxEnergyLevel: number;
};

export const useUserState = createGlobalState<TUserData>("userData", {
  // _id: new ObjectId(),
  userId: 1,
  coins: 443,
  incrementBy: 2,
  incrementByCost: 10,
  incrementSpeed: 1,
  incrementSpeedCost: 10,
  maxEnergy: 111,
  maxEnergyCost: 10,
  maxEnergyLevel: 1,
});
