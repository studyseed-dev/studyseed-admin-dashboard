type QuestionStyles =
  | "multiple_choice_question"
  | "drag_and_drop"
  | "matching"
  | "fill_in_the_blank"
  | "true_false"
  | "multiple_selection"
  | "tnd"
  | "dummy";

interface BaseQuestion {
  question_label?: string;
  question_number: string;
  question_text: string;
  question_style: QuestionStyles;
  image?: string;
  hint: string;
}

export enum TapAndDropStyle {
  CATEGORIES = "CATEGORIES",
  INDIVIDUAL = "INDIVIDUAL",
}
export interface TapAndDropType extends BaseQuestion {
  question_style: "tnd";
  options: string[];
  correct_answer:
    | {
        [key: string]: string[];
      }
    | string[];

  tndStyle: TapAndDropStyle;
  numOfDropBox?: number;
  categories?: string[];
}

// Multiple Selection interface (MCQ but can select more than one)
export interface MSQtype extends BaseQuestion {
  question_style: "multiple_selection";
  possible_answers: string[]; // Array of possible options for MSQ
  correct_answer: string[]; // Correct answers should be an array of strings
}

// True or False interface
export interface TrueFalseType extends BaseQuestion {
  question_style: "true_false";
  correct_answer: boolean;
}

// MCQ-specific interface
export interface MCQtype extends BaseQuestion {
  question_style: "multiple_choice_question";
  possible_answers: string[]; // Array of possible options for MCQ
  correct_answer: string; // Correct answer should be a string
}

// Drag-and-Drop-specific interface
export interface DndType extends BaseQuestion {
  question_style: "drag_and_drop";
  correct_answer: string[];
}

// Matching-specific interface
export interface MatchingType extends BaseQuestion {
  question_style: "matching";
  correct_answer: Record<string, string>;
  options: string[];
  answers: string[];
}

// Fill-in-the-Blanks-specific interface
export interface FillBlankType extends BaseQuestion {
  question_style: "fill_in_the_blank";
  correct_answer: string[];
  display_info: string;
  num_of_text_box: number;
  placeholders?: string[];
  capitalisation: boolean /** does capitalisation matter for this question? */;
}

export interface DummyType extends BaseQuestion {
  question_style: "dummy";
  correct_answer: string;
  question_number: string;
  hint: string;
}

export interface QuizQuestions {
  [key: string]: Question[];
}

export type Question =
  | MCQtype
  | DndType
  | MatchingType
  | FillBlankType
  | DummyType
  | TrueFalseType
  | MSQtype
  | TapAndDropType;
