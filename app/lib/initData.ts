import clientPromise from "./dbconnection";
import { Collection, Db, MongoClient } from "mongodb";
import { unstable_noStore as noStore } from "next/cache";
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

let client: MongoClient;
let db: Db;
let col: Collection;

export async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = client.db("fakeData");
    col = db.collection("telegramTapBot");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to connect to database!");
  }
}

export async function getUserData(userId: number) {
  noStore();

  try {
    if (!col) await init();

    const user = await col.findOne({ userId });

    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { error: "Failed to fetch user data" };
  }
}
