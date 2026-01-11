import mongoose from "mongoose";
import { Question } from "@/lib/questionTypes";

const questionSubSchema = new mongoose.Schema(
  {
    question_number: {
      type: String,
      required: true,
    },
  },
  {
    strict: false, // ← allows different question types safely
    _id: false,
  }
);

const moduleSchema = new mongoose.Schema(
  {
    module_id: {
      type: String,
      required: true,
    },
    questions: {
      type: [questionSubSchema],
      default: [],
    },
  },
  {
    _id: false,
  }
);

export const questionSchema = new mongoose.Schema(
  {
    modules: {
      type: [moduleSchema],
      default: [],
    },
  },
  { strict: true }
);

export const GLPNumeracyQuestions =
  mongoose.models.GLPNumeracy || mongoose.model("GLPNumeracy", questionSchema, "glp_numeracy");

export const GLPLiteracyQuestions =
  mongoose.models.GLPLiteracy || mongoose.model("GLPLiteracy", questionSchema, "glp_literacy");

// Used for GET requests payload
export type GLPQuestionsPayload = {
  modules: Module[];
};

export type Module = {
  module_id: string;
  questions: Question[];
};
