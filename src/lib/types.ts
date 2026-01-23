import { Course } from "@/enums/courses.enum";
import { Topic } from "@/enums/topics.enum";
import { ZodQuestionSchema } from "./questionSchema";

// course module name (EL1, L12...) is key and value is an array of tuples
// tuple's first element is the score and second element is the date
export type SubjectScores = Record<string, [number, string][]>;

export type ModuleTopic = Record<Topic, SubjectScores>;

export type ProgressModel = Record<Course, ModuleTopic>;

export type UpdateQuestionPayload = {
  course?: Course;
  topic: Topic;
  module_id?: string;
  question_number: string;
  updates: ZodQuestionSchema;
};
