import mongoose from "mongoose";

export const weekSchema = {
  activeDate: String,
  allQuestions: {
    type: Map,
    of: [Object],
  },
};

// used outside when questions are fetched from the database
export type QuestionSchema = {
  [key: string]: typeof weekSchema;
};

export const questionSchema = new mongoose.Schema(
  {
    week: {
      type: Map,
      of: weekSchema,
      default: {},
    },
  },
  { strict: true }
);

export const NumeracyQuestions =
  (mongoose.models && mongoose.models.NumeracyQuestions) ||
  mongoose.model("NumeracyQuestions", questionSchema, "numeracy_questions");
export const LiteracyQuestions =
  (mongoose.models && mongoose.models.LiteracyQuestions) ||
  mongoose.model("LiteracyQuestions", questionSchema, "literacy_questions");
