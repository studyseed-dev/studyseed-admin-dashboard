import { useContext } from "react";
import { QuestionsContext } from "@/context/QuestionsContext";

export const useQuestions = () => {
  const context = useContext(QuestionsContext);

  if (!context) {
    throw new Error("useQuestions must be used within a QuestionsProvider");
  }

  return context;
};
