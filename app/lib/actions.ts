"use server";

import { ObjectId } from "mongodb";
import clientPromise from "./dbconnection";
import { IUserData, TUserData } from "../types/types";
import { DEFAULT_USER_DATA } from "./initData";
import { determineCurrentLevel, LEVELS } from "./determineLevel";

async function createNewUser(col: any, userId: number): Promise<IUserData> {
  const newUser = {
    _id: new ObjectId(),
    ...DEFAULT_USER_DATA,
    tel_user_id: userId,
  };

  await col.insertOne(newUser);
  return newUser;
}

export async function getUserData(
  userId: number
): Promise<TUserData | { error: string }> {
  try {
    const client = await clientPromise;
    const col = client.db("fakeData").collection("telegramTapBot");

    if (!userId == null) {
      return {
        error: "Provide a user ID",
      };
    }

    let user = await col.findOne(
      { tel_user_id: userId },
      { projection: { _id: 0 } }
    );

    // If user doesn't exist, create a new user
    if (!user) {
      user = await createNewUser(col, userId);
    }

    return user as TUserData;
  } catch (error) {
    console.error("Error:", error);
    return {
      error: "Database Error: Failed to get user data",
    };
  }
}

export async function incrementCoins(
  userId: number,
  coins: number
): Promise<{ success: boolean } | { error: string }> {
  try {
    const client = await clientPromise;
    const col = client.db("fakeData").collection("telegramTapBot");

    if (!userId || coins == null) {
      return {
        error: "Provide user ID and coins count",
      };
    }

    const userDoc = await col.findOne({ tel_user_id: userId });

    if (!userDoc) return { error: "user not found" };
    const currentCoins = userDoc ? userDoc.coins : 0;
    const newCoins = currentCoins + coins;
    const newLevel = determineCurrentLevel(newCoins);

    await col.updateOne(
      { tel_user_id: userId },
      {
        $inc: { coins: coins, current_energy: -coins },
        $set: {
          level: newLevel ? LEVELS[newLevel].name : "Novice Navigator",
        },
      },
      { upsert: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return {
      error: "Database Error: Failed to increment coins.",
    };
  }
}

export async function UpdateEnergy(
  userId: number,
  energy: number
): Promise<{ updatedUserData: any; success: boolean } | { error: string }> {
  try {
    const client = await clientPromise;
    const col = client.db("fakeData").collection("telegramTapBot");

    // Validate input
    if (!userId || energy == null) {
      return { error: "Provide user ID and energy" };
    }

    // Fetch the user's data
    const userData = await col.findOne({ tel_user_id: userId });

    // Check if the user's data exists
    if (!userData) {
      return { error: "User not found" };
    }

    // Calculate the time difference between now and the last time energy was used
    const lastTimeUsed = userData.last_time_free_energy_used;
    const now = new Date();
    const timeDiff = now.getTime() - lastTimeUsed.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // Check if at least 2 hours have passed since the last energy use
    if (hoursDiff < 2) {
      return { error: "Energy can only be updated every 2 hours" };
    }

    // Update the user's current energy and last time energy was used
    const updatedUserData = await col.updateOne(
      { tel_user_id: userId },
      {
        $set: {
          current_energy: energy,
          last_time_free_energy_used: now, // Set to current date and time
        },
      },
      { upsert: true }
    );

    return { updatedUserData, success: true };
  } catch (error) {
    console.error("Error:", error);
    return {
      error: "Database Error: Failed to update energy.",
    };
  }
}

export async function incrementCoinsPerTap(userId: number) {
  try {
    const client = await clientPromise;
    const col = client.db("fakeData").collection("telegramTapBot");

    if (!userId) {
      return {
        error: "Provide user ID",
      };
    }

    const userDoc = await col.findOne({ tel_user_id: userId });

    if (!userDoc) return { error: "user not found" };

    const currentLevel = userDoc.increment_level + 1;
    const minCost = 5000;
    const maxCost = 20000000;
    const totalLevels = 20;

    // Calculate cost using exponential growth
    const incrementCost = Math.round(
      minCost *
        Math.pow(maxCost / minCost, (currentLevel - 1) / (totalLevels - 1))
    );

    await col.updateOne(
      { tel_user_id: userId },
      {
        $set: {
          coins: userDoc.coins - userDoc.increment_cost,
          increment_amount: userDoc.increment_amount + 1,
          increment_level: currentLevel,
          increment_cost: incrementCost,
        },
      },
      { upsert: true }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      error: "Database Error: Failed to increment coins per tap.",
    };
  }
}

export async function incrementRechargeSpeed(
  userId: number,
  level: number,
  cost: number
) {
  try {
    const client = await clientPromise;
    const col = client.db("fakeData").collection("telegramTapBot");

    if (!userId || level == null || cost == null) {
      return {
        error: "Provide user ID and level and cost",
      };
    }

    await col.updateOne(
      { userId },
      {
        $set: {
          incrementSpeed: level,
          incrementSpeedCost: cost,
        },
      },
      { upsert: true }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      error: "Database Error: Failed to increment speed.",
    };
  }
}

export async function incrementMaxEnergyLimit(
  userId: number,
  energy: number,
  level: number,
  cost: number
) {
  try {
    const client = await clientPromise;
    const col = client.db("fakeData").collection("telegramTapBot");

    if (!userId || level == null || cost == null) {
      return {
        error: "Provide user ID and level and cost",
      };
    }

    await col.updateOne(
      { userId },
      {
        $set: {
          maxEnergy: energy,
          maxEnergyLevel: level,
          maxEnergyCost: cost,
        },
      },
      { upsert: true }
    );

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      error: "Database Error: Failed to update max energy.",
    };
  }
}
