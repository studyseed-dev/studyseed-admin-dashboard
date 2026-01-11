import React from "react";
import { Question } from "@/lib/questionTypes";
import { MCQForm } from "./MCQForm";
import { Button } from "@/components/ui/button";
import { FillBlankForm } from "./FillBlankForm";
import { TrueFalseForm } from "./TrueFalseForm";
import { MSQForm } from "./MSQForm";

interface QuestionEditorProps {
  question: Question;
}

export default function QuestionEditor({ question }: QuestionEditorProps) {
  if (!question) return null;

  const renderEditor = () => {
    switch (question.question_style) {
      case "multiple_choice_question":
        return <MCQForm question={question} />;

      case "multiple_selection":
        // TODO: Implement MSQForm component
        return <MSQForm question={question} />;

      case "true_false":
        return <TrueFalseForm question={question} />;

      case "matching":
        return (
          <div className="space-y-4">
            <p className="text-red-600">Matching form not yet implemented</p>
            <Button variant="secondary">Close</Button>
          </div>
        );

      case "fill_in_the_blank":
        return <FillBlankForm question={question} />;
      case "drag_and_drop":
        // TODO: Implement DragAndDropForm component
        return (
          <div className="space-y-4">
            <p className="text-red-600">Drag and Drop form not yet implemented</p>
            <Button variant="secondary">Close</Button>
          </div>
        );

      case "tnd":
        // TODO: Implement TapAndDropForm component
        return (
          <div className="space-y-4">
            <p className="text-red-600">Tap and Drop form not yet implemented</p>
            <Button variant="secondary">Close</Button>
          </div>
        );

      case "dummy":
        // Dummy questions might not need editing
        return (
          <div className="space-y-4">
            <p className="text-gray-600">Dummy questions cannot be edited</p>
            <Button variant="secondary">Close</Button>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <p className="text-red-600">Unknown question type</p>
            <Button variant="secondary">Close</Button>
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border-2 border-blue-500 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-blue-600">Edit Question</h3>
      </div>

      {renderEditor()}
    </div>
  );
}
