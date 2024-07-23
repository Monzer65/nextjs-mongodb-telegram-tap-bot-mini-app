import { NextRequest } from "next/server";
import clientPromise from "@/app/lib/dbConnection";
import {
  decodeRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return new Response(
      JSON.stringify({ error: "No Refresh Token Provided!" }),
      { status: 401 }
    );
  }

  try {
    const client = await clientPromise;
    const collection = client.db("fakeData").collection("users");

    // Attempt to find user with the provided refresh token
    const user = await collection.findOne({
      refreshToken: { $in: [refreshToken] },
    });

    if (!user) {
      // If no user is found, check if the refresh token is compromised
      const decodedRefreshToken = await decodeRefreshToken(refreshToken);

      if (!decodedRefreshToken) {
        return new Response(
          JSON.stringify({ error: "Invalid Refresh Token" }),
          { status: 403 }
        );
      }

      // Invalidate all refresh tokens for the compromised user
      await collection.updateOne(
        { username: decodedRefreshToken.username },
        { $set: { refreshToken: [] } }
      );

      return new Response(JSON.stringify({ error: "Unauthorized Access!" }), {
        status: 403,
      });
    }

    const accessExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Generate new access and refresh tokens
    const newAccessToken = await generateAccessToken({
      username: user.username,
      roles: user.roles,
      expires: accessExpiry,
    });

    const newRefreshToken = await generateRefreshToken({
      username: user.username,
      expires: refreshExpiry,
    });

    // Update the user's refresh tokens in the database
    await collection.updateOne(
      { _id: user._id },
      { $set: { refreshToken: [newRefreshToken] } }
    );

    return new Response(JSON.stringify({ newAccessToken, newRefreshToken }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

//     user.refreshToken = user.refreshToken
//       .filter((rt: string) => rt !== refreshToken)
//       .concat(newRefreshToken);
//     await collection.updateOne({ _id: user._id }, { $set: user });
