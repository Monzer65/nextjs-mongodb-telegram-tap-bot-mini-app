"use server";

import clientPromise from "./dbconnection";

export async function incrementCoins(userId: number, coins: number) {
  try {
    const client = await clientPromise;
    const col = client.db("fakeData").collection("telegramTapBot");

    if (!userId || coins == null) {
      return {
        error: "Provide user ID and coins count",
      };
    }

    await col.updateOne({ userId }, { $inc: { coins } }, { upsert: true });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      error: "Database Error: Failed to increment coins.",
    };
  }
}

export async function incrementCoinsPerTap(
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
          incrementBy: level,
          incrementByCost: cost,
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
