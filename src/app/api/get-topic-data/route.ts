import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { connectToMongoDB } from "@/lib/mongodb";
import { QuestionSchema } from "@/Models/Question";
import { fetchQuestions } from "./getTopicData";
import { Topic } from "@/enums/topics.enum";
import { Course } from "@/enums/courses.enum";

export async function GET(request: NextRequest) {
  await connectToMongoDB();

  // Get query parameters from URL
  const searchParams = request.nextUrl.searchParams;
  const topic = searchParams.get("topic") as Topic;
  const courseEnrolled = searchParams.get("courseEnrolled") as Course;

  // Validate query parameters
  if (!topic || !courseEnrolled) {
    return NextResponse.json(
      { error: "Missing topic or courseEnrolled parameter" },
      { status: 400 }
    );
  }

  // Get auth token from cookies
  const cookies = parse(request.headers.get("cookie") || "");
  const token = cookies.authToken;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);

    const gameQuestions = (await fetchQuestions(courseEnrolled, topic)) as QuestionSchema;

    if (gameQuestions && gameQuestions.error) {
      return NextResponse.json({ error: gameQuestions.error }, { status: 400 });
    }

    if (!gameQuestions) {
      return NextResponse.json({ error: `Questions not found for ${topic}` }, { status: 404 });
    }

    return NextResponse.json({ data: gameQuestions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Internal error occurred when fetching ${topic} questions` },
      { status: 500 }
    );
  }
}
