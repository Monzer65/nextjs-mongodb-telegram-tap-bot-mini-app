"use server";
import { cookies } from "next/headers";
import clientPromise from "./dbConnection";
import { redirect } from "next/navigation";
import { generateAccessToken, generateRefreshToken } from "./auth";
import { validateEmail, validatePassword } from "./validateForms";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

const generateUniqueUsername = (email: string) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return email.split("@")[0] + "_" + randomString + "_" + timestamp;
};

export async function signup(_currentState: unknown, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm_Password");

  if (!email || !password || !confirmPassword) {
    return "Please fill in all the fields";
  }

  if (
    !validateEmail(email.toString()) ||
    !validatePassword(password.toString())
  ) {
    return "Please enter a valid email or password. The password must be at least 6 characters long";
  }

  if (password !== confirmPassword) {
    return "The password and confirmation password do not match";
  }

  try {
    const client = await clientPromise;
    const collection = client.db("fakeData").collection("users");
    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      return "The user is already registered; please use the login link";
    }

    const hash = await bcrypt.hash(password.toString(), 8);

    const newUser = {
      _id: new ObjectId(),
      username: generateUniqueUsername(email.toString()),
      email,
      password: hash,
      roles: ["user"],
      refreshToken: [] as string[],
      address: "",
      createdAt: new Date(),
    };

    await collection.insertOne(newUser);

    const accessExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const accessToken = await generateAccessToken({
      username: newUser.username,
      roles: newUser.roles,
      expires: accessExpiry,
    });

    const refreshToken = await generateRefreshToken({
      username: newUser.username,
      expires: refreshExpiry,
    });

    newUser.refreshToken.push(refreshToken);
    await collection.updateOne({ _id: newUser._id }, { $set: newUser });

    cookies().set("accessToken", accessToken, {
      expires: accessExpiry,
      httpOnly: true,
    });

    cookies().set("refreshToken", refreshToken, {
      expires: refreshExpiry,
      httpOnly: true,
    });
  } catch (error) {
    console.error("Database error:", error);
    return "Database error. Please try again later";
  }
  redirect("/dashboard");
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return "Please fill in all the fields";
  }

  if (
    !validateEmail(email.toString()) ||
    !validatePassword(password.toString())
  ) {
    return "Please enter a valid email or password. The password must be at least 6 characters long";
  }

  try {
    const client = await clientPromise;
    const collection = client.db("fakeData").collection("users");
    const user = await collection.findOne({ email });

    if (!user) {
      return "User not found";
    }

    const isMatchPassword = await bcrypt.compare(
      password.toString(),
      user.password
    );
    if (!isMatchPassword) {
      return "Wrong password";
    }

    const accessExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const accessToken = await generateAccessToken({
      username: user.username,
      roles: user.roles,
      expires: accessExpiry,
    });

    const refreshToken = await generateRefreshToken({
      username: user.username,
      expires: refreshExpiry,
    });

    user.refreshToken = [];
    user.refreshToken.push(refreshToken);
    await collection.updateOne({ _id: user._id }, { $set: user });

    cookies().set("accessToken", accessToken, {
      expires: accessExpiry,
      httpOnly: true,
    });

    cookies().set("refreshToken", refreshToken, {
      expires: refreshExpiry,
      httpOnly: true,
    });

    console.log("Redirecting to /blog/dashboard");
  } catch (error) {
    console.error("Database error:", error);
    return "Database error. Please try again later";
  }

  redirect("/dashboard");
}

export async function logout(_currentState: unknown) {
  const refreshToken = cookies().get("refreshToken")?.value;

  if (!refreshToken) {
    console.error("Refresh token not found in cookies.");
    cookies().set("accessToken", "", { expires: new Date(0) });
    redirect("/");
  }

  try {
    const client = await clientPromise;
    const collection = client.db("fakeData").collection("users");
    const user = await collection.findOne({
      refreshToken: { $in: [refreshToken] },
    });

    if (!user) {
      console.error("User not found with the provided refresh token.");
      return "User not found.";
    }
  } catch (error) {
    console.error("Database error:", error);
    return "Database error. Please try again later";
  }

  // Clear cookies
  cookies().set("accessToken", "", { expires: new Date(0) });
  cookies().set("refreshToken", "", { expires: new Date(0) });

  redirect("/");
}
