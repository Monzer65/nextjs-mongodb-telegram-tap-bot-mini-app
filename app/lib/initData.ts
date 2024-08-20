import { IUserData } from "../types/types";

export const DEFAULT_USER_DATA: Omit<IUserData, "_id"> = {
  tel_user_id: 0,
  coins: 100,
  level: "Novice Navigator",
  increment_amount: 1,
  increment_cost: 100,
  increment_level: 1,
  speed: 1,
  speed_cost: 100,
  speed_level: 1,
  max_energy: 500,
  max_energy_cost: 100,
  max_energy_level: 1,
  current_energy: 100,
  last_time_free_energy_used: new Date(
    new Date().getTime() - 2 * 60 * 60 * 1000
  ),
};
