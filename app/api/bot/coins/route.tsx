import clientPromise from "@/app/lib/dbconnection";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User Id is Required" }), {
        status: 400,
      });
    }

    const client = await clientPromise;
    const col = client.db("fakeData").collection("telegramTapBot");

    const user = await col.findOne({ userId });

    return new Response(JSON.stringify({ coins: user?.coins }), {
      status: 200,
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
