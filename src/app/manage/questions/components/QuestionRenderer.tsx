import { Question } from "@/lib/questionTypes";
import React from "react";

export default function QuestionRenderer({ question }: { question: Question }) {
  if (!question) return null;

  switch (question.question_style) {
    case "multiple_choice_question":
      return (
        <div className="mt-3 space-y-2">
          <span className="mb-3">{question.question_text}</span>
          {(question.possible_answers || []).map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2 mt-2">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  question.correct_answer === opt
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
              >
                {question.correct_answer === opt && (
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                )}
              </div>
              <span className="text-sm text-gray-700">{opt}</span>
            </div>
          ))}
        </div>
      );

    case "matching":
      return (
        <>
          <span>{question.question_text}</span>
          <ol className="mt-2 text-sm text-gray-700">
            {question.correct_answer &&
              Object.entries(question.correct_answer).map(([k, v], index) => (
                <li className="flex space-x-2" key={k}>
                  <p>
                    {index + 1}. {k} →
                  </p>
                  <p className="text-green-600 font-medium">{v}</p>
                </li>
              ))}
          </ol>
        </>
      );

    case "fill_in_the_blank":
      return (
        <>
          <span>{question.question_text}</span>
          {question.display_info && (
            <p className="mt-2 text-sm font-medium">{question.display_info}</p>
          )}
          <p className="mt-2 text-sm text-green-600 font-medium">
            Correct answer: {String(question.correct_answer)}
          </p>
        </>
      );

    // Rearrange
    case "drag_and_drop":
      return (
        <>
          <span>{question.question_text}</span>
          <p className="mt-2 text-sm text-green-600 font-medium">
            Correct answer:
            {Array.isArray(question.correct_answer)
              ? question.correct_answer.join("")
              : String(question.correct_answer)}
          </p>
        </>
      );

    case "true_false":
      return (
        <>
          <span>{question.question_text}</span>
          <p className="mt-2 text-sm text-green-600 font-medium">
            Correct answer: {String(question.correct_answer)}
          </p>
        </>
      );

    case "tnd":
      return (
        <>
          <span>{question.question_text}</span>
          <ol className="mt-2 text-sm text-green-600 font-medium">
            Correct answer:{" "}
            {Array.isArray(question.correct_answer)
              ? question.correct_answer.join(" ")
              : Object.entries(question.correct_answer).map(([category, answer], index) => (
                  <li className="flex space-x-2" key={category}>
                    <p>
                      {index + 1}. {category} →
                    </p>
                    <p className="text-green-600 font-medium">{answer.join(" ")}</p>
                  </li>
                ))}
          </ol>
        </>
      );

    case "multiple_selection":
      return (
        <div className="mt-3 space-y-2">
          <span className="mb-3">{question.question_text}</span>
          {question.possible_answers.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2 mt-2">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  question.correct_answer.includes(opt)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
              >
                {question.correct_answer.includes(opt) && (
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                )}
              </div>
              <span className="text-sm text-gray-700">{opt}</span>
            </div>
          ))}
        </div>
      );

    default:
      return <span>{question.question_text}</span>;
  }
}
