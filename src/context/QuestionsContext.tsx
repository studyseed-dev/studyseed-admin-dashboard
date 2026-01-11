"use client";

import { createContext, useState, useCallback, useMemo } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DashboardAPIPath } from "@/enums/apiPaths.enum";
import { Course } from "@/enums/courses.enum";
import { Topic } from "@/enums/topics.enum";
import { Question } from "@/lib/questionTypes";
import { GLPQuestionsPayload, Module } from "@/Models/GLPQuestion";
import { updateQuestionFn } from "@/lib/networkFunctions";
import { UpdateQuestionPayload } from "@/lib/types";
import { ZodQuestionSchema } from "@/lib/questionSchema";

export interface QuestionsContextType {
  selectedTopic: Topic;
  selectedCourse: Course | undefined;
  selectedModule: string | undefined;
  modules?: Record<string, Question[]>;
  isLoading: boolean;
  questions: GLPQuestionsPayload | undefined;
  selectTopic: (topic: Topic | undefined) => void;
  selectCourse: (course: Course | undefined) => void;
  selectModule: (module: string | undefined) => void;
  currentModule: Module | undefined;
  editingQuestion: Question | null;
  setEditingQuestion: (question: Question | null) => void;
  isQuestionUpdating: boolean;
  handleUpdateQuestion: (updates: ZodQuestionSchema) => void;
}

export const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

const getTopicData = async (
  topic: Topic | undefined,
  courseEnrolled: Course | undefined
): Promise<GLPQuestionsPayload | undefined> => {
  if (!topic || !courseEnrolled) return undefined;

  const response = await fetch(
    `${DashboardAPIPath.GET_TOPIC_DATA}?topic=${topic}&courseEnrolled=${courseEnrolled}`
  );

  if (!response.ok) return undefined;

  const resObj = await response.json();
  return resObj.data;
};

export const QuestionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const [selectedTopic, setSelectedTopic] = useState<Topic>(Topic.LITERACY);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [selectedModule, setSelectedModule] = useState<string | undefined>(undefined);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const { data: questions, isLoading } = useQuery<GLPQuestionsPayload | undefined>({
    queryKey: ["topic-data", selectedTopic, selectedCourse],
    queryFn: () => getTopicData(selectedTopic, selectedCourse),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled: !!selectedCourse && !!selectedTopic,
  });

  const { isPending: isQuestionUpdating, mutateAsync } = useMutation({
    mutationFn: updateQuestionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topic-data", selectedTopic, selectedCourse] });

      setEditingQuestion(null);
    },
  });

  const handleUpdateQuestion = (updates: ZodQuestionSchema) => {
    const updatePayload: UpdateQuestionPayload = {
      course: selectedCourse,
      topic: selectedTopic,
      module_id: selectedModule,
      question_number: updates.question_number,
      updates: updates,
    };
    mutateAsync(updatePayload);
  };

  const selectTopic = useCallback((topic: Topic | undefined) => {
    if (topic) setSelectedTopic(topic);
  }, []);

  const selectCourse = useCallback((course: Course | undefined) => {
    if (course) setSelectedCourse(course);
  }, []);

  const selectModule = useCallback((module: string | undefined) => {
    if (module) setSelectedModule(module);
  }, []);

  const currentModule = useMemo(() => {
    if (!questions) return undefined;

    if (selectedModule) {
      return questions.modules.find((module) => module.module_id === selectedModule);
    }

    return undefined;
  }, [questions, selectedModule]);

  return (
    <QuestionsContext.Provider
      value={{
        selectedTopic,
        selectedCourse,
        selectedModule,
        questions,
        isLoading,
        selectTopic,
        selectCourse,
        selectModule,
        currentModule,
        editingQuestion,
        setEditingQuestion,
        isQuestionUpdating,
        handleUpdateQuestion,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};
