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

export async function incrementCoinsPerTap(userId: number, coins: number) {
  try {
    const client = await clientPromise;
    const col = client.db("fakeData").collection("telegramTapBot");

    if (!userId || coins == null) {
      return {
        error: "Provide user ID and coins count",
      };
    }

    await col.updateOne(
      { userId },
      { $inc: { coinsPerTap: coins } },
      { upsert: true }
    );

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
