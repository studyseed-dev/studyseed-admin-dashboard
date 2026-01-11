import { Course } from "@/enums/courses.enum";
import { Topic } from "@/enums/topics.enum";
import { GES2LiteracyQuestions, GES2NumeracyQuestions } from "@/Models/GES2Question";
import {
  GLPLiteracyQuestions,
  GLPNumeracyQuestions,
  GLPQuestionsPayload,
} from "@/Models/GLPQuestion";
import { LiteracyQuestions, NumeracyQuestions, QuestionSchema } from "@/Models/Question";

export const fetchQuestions = async (
  courseEnrolled: Course,
  topic: Topic
): Promise<QuestionSchema | GLPQuestionsPayload | { [error: string]: string }> => {
  switch (courseEnrolled) {
    case Course.GES:
      switch (topic.toUpperCase()) {
        case "NUMERACY":
          return (await NumeracyQuestions.findOne().lean()) as unknown as QuestionSchema;
        case "LITERACY":
          return (await LiteracyQuestions.findOne().lean()) as unknown as QuestionSchema;
        default:
          return { error: `Invalid topic: ${topic}` };
      }

    case Course.GES2:
      switch (topic.toUpperCase()) {
        case "NUMERACY":
          return (await GES2NumeracyQuestions.findOne().lean()) as unknown as QuestionSchema;
        case "LITERACY":
          return (await GES2LiteracyQuestions.findOne().lean()) as unknown as QuestionSchema;
        default:
          return { error: `Invalid topic: ${topic}` };
      }

    case Course.GLP:
      switch (topic.toUpperCase()) {
        case "NUMERACY":
          return (await GLPNumeracyQuestions.findOne().lean()) as unknown as GLPQuestionsPayload;
        case "LITERACY":
          return (await GLPLiteracyQuestions.findOne().lean()) as unknown as GLPQuestionsPayload;
        default:
          return { error: `Invalid topic: ${topic}` };
      }

    default:
      return { error: `Invalid course enrolled: ${courseEnrolled}` };
  }
};
