import { NextResponse } from "next/server";
import { parse } from "cookie";

import { User } from "@/Models/User";
import { connectToMongoDB } from "@/lib/mongodb";
import { verifyAuthToken } from "@/lib/auth";

export async function GET(request: Request) {
  await connectToMongoDB();

  const cookies = parse(request.headers.get("cookie") || "");
  const token = cookies.authToken;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = verifyAuthToken(token);

  const allUsers = await User.find().sort({ _id: -1 }).lean();

  const data = { allUsers };

  return NextResponse.json({ data, user: decoded });
}
