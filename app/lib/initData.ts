import clientPromise from "./dbconnection";
import { Collection, Db, MongoClient } from "mongodb";
import { unstable_noStore as noStore } from "next/cache";

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
