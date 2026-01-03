import { Course } from "@/enums/courses.enum";
import { Topic } from "@/enums/topics.enum";
import { GES2NumeracyQuestions, GES2LiteracyQuestions } from "@/Models/GES2Question";
import { LiteracyQuestions, NumeracyQuestions, QuestionSchema } from "@/Models/Question";

export const fetchQuestions = async (
  courseEnrolled: Course,
  topic: Topic
): Promise<QuestionSchema | { [error: string]: string }> => {
  switch (courseEnrolled) {
    case "GES":
      switch (topic.toUpperCase()) {
        case "NUMERACY":
          return (await NumeracyQuestions.findOne().lean()) as unknown as QuestionSchema;
        case "LITERACY":
          return (await LiteracyQuestions.findOne().lean()) as unknown as QuestionSchema;
        default:
          return { error: `Invalid topic: ${topic}` };
      }

    case "GES2":
      switch (topic.toUpperCase()) {
        case "NUMERACY":
          return (await GES2NumeracyQuestions.findOne().lean()) as unknown as QuestionSchema;
        case "LITERACY":
          return (await GES2LiteracyQuestions.findOne().lean()) as unknown as QuestionSchema;
        default:
          return { error: `Invalid topic: ${topic}` };
      }

    default:
      return { error: `Invalid course enrolled: ${courseEnrolled}` };
  }
};
