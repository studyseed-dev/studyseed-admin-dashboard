"use client";

import { useForm } from "react-hook-form";
import { Input } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";

import { Textarea } from "@/components/ui/textarea";
import { ZodTrueFalseSchema, TrueFalseSchema } from "@/lib/questionSchema";
import { TrueFalseType } from "@/lib/questionTypes";
import { useQuestions } from "@/context/QuestionsContext";

import { FormActionButtons } from "./FormActionButtons";

interface TrueFalseFormProps {
  question: TrueFalseType;
}

export function TrueFalseForm({ question }: TrueFalseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ZodTrueFalseSchema>({
    resolver: zodResolver(TrueFalseSchema),
    defaultValues: {
      question_number: question.question_number,
      question_text: question.question_text,
      question_style: "true_false",
      correct_answer: question.correct_answer,
      hint: question.hint || "",
      question_label: question.question_label,
      image: question.image,
    },
  });
  const { setEditingQuestion, handleUpdateQuestion, isQuestionUpdating } = useQuestions();

  const correctAnswer = watch("correct_answer");

  return (
    <form onSubmit={handleSubmit(handleUpdateQuestion)} className="space-y-6 w-full">
      {/* Question Number */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Question Number</label>
        <Input
          {...register("question_number")}
          placeholder="e.g., Q1"
          className={errors.question_number ? "border-red-500" : ""}
        />
        {errors.question_number && (
          <p className="text-red-500 text-sm mt-1">{errors.question_number.message}</p>
        )}
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Question Text *</label>
        <Textarea
          {...register("question_text")}
          placeholder="Enter your true/false statement..."
          rows={3}
          className={errors.question_text ? "border-red-500" : ""}
        />
        {errors.question_text && (
          <p className="text-red-500 text-sm mt-1">{errors.question_text.message}</p>
        )}
      </div>

      {/* Correct Answer */}
      <div>
        <label className="block text-sm font-semibold mb-3 text-gray-700">Correct Answer *</label>
        <div className="flex gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              checked={correctAnswer === true}
              onChange={() => setValue("correct_answer", true)}
              className="mr-3 w-4 h-4"
            />
            <span className="text-lg">True</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              checked={correctAnswer === false}
              onChange={() => setValue("correct_answer", false)}
              className="mr-3 w-4 h-4"
            />
            <span className="text-lg">False</span>
          </label>
        </div>
        {errors.correct_answer && (
          <p className="text-red-500 text-sm mt-2">{errors.correct_answer.message}</p>
        )}
      </div>

      {/* Hint */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">Hint *</label>
        <Textarea
          {...register("hint")}
          placeholder="Provide a helpful hint..."
          rows={2}
          className={errors.hint ? "border-red-500" : ""}
        />
        {errors.hint && <p className="text-red-500 text-sm mt-1">{errors.hint.message}</p>}
      </div>

      {/* Image URL (Optional) */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Image URL (Optional)
        </label>
        <Input {...register("image")} placeholder="https://example.com/image.jpg" type="url" />
      </div>

      <FormActionButtons
        isUpdating={isQuestionUpdating}
        onCancel={() => setEditingQuestion(null)}
      />
    </form>
  );
}
