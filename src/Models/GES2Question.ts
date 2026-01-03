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

export const GES2NumeracyQuestions =
  (mongoose.models && mongoose.models.GES2NumeracyQuestions) ||
  mongoose.model("GES2NumeracyQuestions", questionSchema, "ges2_numeracy_questions");
export const GES2LiteracyQuestions =
  (mongoose.models && mongoose.models.GES2LiteracyQuestions) ||
  mongoose.model("GES2LiteracyQuestions", questionSchema, "ges2_literacy_questions");
