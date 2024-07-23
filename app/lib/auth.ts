import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
// import { jwtVerify, SignJWT } from "jose";
import * as jose from "jose";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const accessKey = new TextEncoder().encode(accessTokenSecret);
const refreshKey = new TextEncoder().encode(refreshTokenSecret);

export async function generateAccessToken(payload: any) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + 10 * 60 * 1000))
    .sign(accessKey);
}

export async function generateRefreshToken(payload: any) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    .sign(refreshKey);
}

export async function decodeAccessToken(input: string): Promise<any> {
  const { payload } = await jose.jwtVerify(input, accessKey, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function decodeRefreshToken(input: string): Promise<any> {
  const { payload } = await jose.jwtVerify(input, refreshKey, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function verifyAndRenewSession(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");

  if (!accessToken || !accessToken.value) {
    return await handleRefreshToken(request);
  }

  try {
    const decodedAccessToken = await decodeAccessToken(accessToken.value);

    if (!decodedAccessToken || decodedAccessToken.expires < Date.now()) {
      console.log("Session expired at:", decodedAccessToken.expires);
      return await handleRefreshToken(request);
    }

    if (request.nextUrl.pathname.includes("/admin-area")) {
      if (decodedAccessToken.roles.includes("admin")) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    if (request.nextUrl.pathname.includes("/dashboard")) {
      if (decodedAccessToken.roles.includes("user")) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
    // If accessToken is valid, proceed with the response
    return NextResponse.next();
  } catch (error) {
    console.error("Error decoding accessToken:", error);
    return await handleRefreshToken(request);
  }
}

async function handleRefreshToken(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    // No session and no refresh token
    return new NextResponse("No session or refresh token found", {
      status: 401,
    });
  }

  try {
    const decodedRefresh = await decodeRefreshToken(refreshToken);

    if (!decodedRefresh || decodedRefresh.expires < Date.now()) {
      // Invalid or expired refresh token
      console.log(
        "Refresh token expired or invalid at:",
        decodedRefresh?.expires
      );

      return new NextResponse("Refresh Token is not valid", {
        status: 403,
      });
    }

    const response = await fetch(
      "http://localhost:3000/api/auth/refresh-token",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          cookie: `refreshToken=${refreshToken}`,
        },
      }
    );

    if (!response.ok) {
      return new NextResponse(
        "خطا در دریافت توکن جدید. لطفا دوباره تلاش کنید یا دوباره وارد شوید",
        {
          status: 401,
        }
      );
    }

    const { newAccessToken, newRefreshToken } = await response.json();

    if (!newAccessToken || !newRefreshToken) {
      return new NextResponse("Failed to generate new tokens", { status: 500 });
    }

    const accessExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Debugging logs
    // console.log("new access token:", newAccessToken);
    // console.log("new refresh token:", newRefreshToken);

    // continue processing the request as usual
    const res = NextResponse.next();

    // Set the session (access token) cookie
    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: accessExpiry, // Correct format
      path: "/",
    });

    // Set the refresh token cookie
    res.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: refreshExpiry, // Correct format
      path: "/",
    });
    return res;
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to refresh session", { status: 500 });
  }
}

export async function getSession(): Promise<any | null> {
  const getCookieValue = async (
    cookieName: string,
    maxRetries: number,
    delay: number
  ): Promise<string | null> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const cookieValue = cookies().get(cookieName)?.value;
      if (cookieValue) {
        return cookieValue;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    return null;
  };

  const accessToken = await getCookieValue("accessToken", 10, 1000);
  if (!accessToken) return null;

  const res = await decodeAccessToken(accessToken);
  return res;
}

// const jwtConfig = {
//   secret: new TextEncoder().encode(process.env.ACCESS_SECRET),
// };

// export const isAuthenticated = async (req: any) => {
//   let token =
//     req.headers.get("authorization") || req.headers.get("Authorization");

//   if (token) {
//     try {
//       if (token.startsWith("Bearer")) {
//         token = token.replace("Bearer ", "");
//       }

//       const decoded = await jwtVerify(token, jwtConfig.secret);

//       if (decoded.payload?.username) {
//         return true;
//       } else {
//         return false;
//       }
//     } catch (err) {
//       console.error("isAuthenticated error: ", err);

//       return false;
//     }
//   } else {
//     return false;
//   }
// };
