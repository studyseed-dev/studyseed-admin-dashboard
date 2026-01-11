import { Course } from "@/enums/courses.enum";
import { Topic } from "@/enums/topics.enum";
import { ZodQuestionSchema } from "./questionSchema";

export const topics = ["LITERACY", "NUMERACY"];
export const courses = [Course.GES, Course.GES2, Course.GLP];
export interface SubjectScores {
  // course module name (EL1, L12...) is key and value is an array of tuples
  // tuple's first element is the score and second element is the date
  [key: string]: [number, string][];
}
export type Topics = (typeof topics)[number];
export type ModuleTopic = {
  [key in Topics]: SubjectScores;
};

export type Courses = (typeof courses)[number];

export type ProgressModel = {
  [K in Courses]: ModuleTopic;
};

export type UpdateQuestionPayload = {
  course?: Course;
  topic: Topic;
  module_id?: string;
  question_number: string;
  updates: ZodQuestionSchema;
};
