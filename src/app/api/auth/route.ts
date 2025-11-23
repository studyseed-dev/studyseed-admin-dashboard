import { parse } from "cookie";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request: Request) {
  try {
    const cookies = parse(request.headers.get("cookie") || "");
    const token = cookies.authToken;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET as string));

    return NextResponse.json({ message: "Authenticated", user: decoded });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Invalid or expired token", error }, { status: 401 });
  }
}
