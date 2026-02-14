import { verifyAuthToken } from "@/lib/auth";
import { parse } from "cookie";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookies = parse(request.headers.get("cookie") || "");
    const token = cookies.authToken;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyAuthToken(token);

    return NextResponse.json({ message: "Authenticated", user: decoded });
  } catch (error) {
    return NextResponse.json({ message: "Invalid or expired token", error }, { status: 401 });
  }
}
