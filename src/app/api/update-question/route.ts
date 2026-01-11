import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import { parse } from "cookie";
import { UpdateQuestionPayload } from "@/lib/types";
// import { updateQuestionSchema } from "@/lib/questionSchema";
import { updateQuestion } from "./updateQuestion";

export async function PUT(request: Request) {
  await connectToMongoDB();

  try {
    /* -------------------- Auth -------------------- */
    const cookies = parse(request.headers.get("cookie") || "");
    const existingToken = cookies.authToken;

    if (!existingToken) {
      return NextResponse.json(
        { message: "Your session has timed out. Please log in again!" },
        { status: 401 }
      );
    }

    /* -------------------- Parse + Validate -------------------- */
    const requestBody: UpdateQuestionPayload = await request.json();

    /* -------------------- Update -------------------- */
    const result = await updateQuestion(requestBody);

    return NextResponse.json({ message: "Question updated successfully", result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update question", error }, { status: 500 });
  }
}
