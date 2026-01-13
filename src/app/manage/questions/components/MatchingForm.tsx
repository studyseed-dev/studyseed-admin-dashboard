"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

import { MatchingSchema, ZodMatchingSchema } from "@/lib/questionSchema";
import { MatchingType } from "@/lib/questionTypes";
import { useQuestions } from "@/hooks/useQuestions";
import { FormActionButtons } from "./FormActionButtons";

interface MatchingFormProps {
  question: MatchingType;
}

export const MatchingForm = ({ question }: MatchingFormProps) => {
  const { setEditingQuestion, isQuestionUpdating, handleUpdateQuestion } = useQuestions();

  const form = useForm<ZodMatchingSchema>({
    resolver: zodResolver(MatchingSchema),
    defaultValues: {
      question_number: question.question_number,
      question_text: question.question_text,
      question_style: "matching",
      hint: question.hint,
      correct_answer: question.correct_answer || { "": "" },
    },
  });

  const correctAnswer = form.watch("correct_answer");

  const optionsArray = Object.keys(correctAnswer);

  return (
    <form onSubmit={form.handleSubmit(handleUpdateQuestion)} className="space-y-8">
      <FieldGroup>
        {/* Question Text */}
        <Field>
          <FieldLabel>Question Text *</FieldLabel>
          <Input {...form.register("question_text")} className="text-sm" />
        </Field>

        {/* Matching Pairs */}
        <Field>
          <FieldLabel>Matching Pairs *</FieldLabel>
          <div className="space-y-3 mt-2">
            {optionsArray.map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {/* Option input */}
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOption = e.target.value.trim();
                    const current = { ...form.getValues("correct_answer") };
                    const answer = current[option];
                    delete current[option];
                    current[newOption] = answer;
                    form.setValue("correct_answer", current, { shouldDirty: true });
                  }}
                  placeholder={`Type option ${idx + 1} text here`}
                  className="text-sm"
                />

                {/* Answer input */}
                {optionsArray[idx].length >= 1 && (
                  <Input
                    value={correctAnswer[option]}
                    onChange={(e) => {
                      const newAnswer = e.target.value.trim();
                      form.setValue(`correct_answer.${option}`, newAnswer, {
                        shouldDirty: true,
                      });
                    }}
                    placeholder={`Type answer ${idx + 1} text here`}
                    className="text-sm"
                  />
                )}

                {/* Remove button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-red-600"
                  onClick={() => {
                    const current = { ...form.getValues("correct_answer") };
                    delete current[option];
                    form.setValue("correct_answer", current, { shouldDirty: true });
                  }}
                  disabled={optionsArray.length <= 1}
                >
                  ✕
                </Button>
              </div>
            ))}

            {/* Add new pair */}
            {Object.keys(correctAnswer).length < 4 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = { ...form.getValues("correct_answer") };
                  current[""] = ""; // placeholder pair
                  form.setValue("correct_answer", current, { shouldDirty: true });
                }}
              >
                + Add Pair
              </Button>
            )}
          </div>

          {form.formState.errors.correct_answer && (
            <FieldError errors={[form.formState.errors.correct_answer]} />
          )}
        </Field>

        {/* Hint */}
        <Field>
          <FieldLabel>Hint</FieldLabel>
          <Input {...form.register("hint")} className="text-sm" />
        </Field>
      </FieldGroup>

      <FormActionButtons
        isUpdating={isQuestionUpdating}
        onCancel={() => setEditingQuestion(null)}
      />
    </form>
  );
};
