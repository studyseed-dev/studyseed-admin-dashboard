import { NextResponse } from "next/server";
import { parse } from "cookie";
import { connectToMongoDB } from "@/lib/mongodb";
import { IUser, User } from "@/Models/User";

export async function DELETE(request: Request) {
  await connectToMongoDB();

  try {
    const cookies = parse(request.headers.get("cookie") || "");
    const existingToken = cookies.authToken;

    if (!existingToken) {
      return NextResponse.json(
        { message: "Your session has timed out. Please log in again!" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userid = body?.userid;

    if (!userid || typeof userid !== "string") {
      return NextResponse.json({ message: "Missing or invalid userid" }, { status: 400 });
    }

    const deletedUser = (await User.findOneAndDelete({ userid })) as IUser | null;

    if (!deletedUser) {
      return NextResponse.json({ message: `User with id: ${userid} not found` }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: `User ${deletedUser.first_name} ${deletedUser.last_name} deleted successfully. Userid: ${userid}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
