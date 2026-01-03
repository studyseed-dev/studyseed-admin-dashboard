import { DashboardAPIPath } from "@/enums/apiPaths.enum";
import { Course } from "@/enums/courses.enum";
import { Topic } from "@/enums/topics.enum";
import { Question } from "@/lib/questionTypes";
import { QuestionSchema } from "@/Models/Question";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

const getTopicData = async (
  topic: Topic,
  courseEnrolled: Course
): Promise<QuestionSchema | undefined> => {
  try {
    const response = await fetch(
      `${DashboardAPIPath.GET_TOPIC_DATA}?topic=${topic}&courseEnrolled=${courseEnrolled}`
    );

    if (response.ok) {
      const resObj = await response.json();
      return resObj.data;
    }

    return undefined;
  } catch (error) {
    console.error("Error fetching topic data:", error);
    throw error; // TanStack Query will handle the error
  }
};

export const useQuestions = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(Topic.LITERACY);
  const [selectedCourse, setSelectedCourse] = useState(Course.GES2);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const { data, isLoading } = useQuery<QuestionSchema | undefined>({
    queryKey: ["topic-data", selectedTopic, selectedCourse],
    queryFn: () => getTopicData(selectedTopic, selectedCourse),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });

  const handleSelectModule = useCallback((module: string | null) => {
    if (!module) return;
    setSelectedModule(module);
  }, []);

  const handleSelectTopic = useCallback((topic: Topic | null) => {
    if (!topic) return;
    setSelectedTopic(topic);
  }, []);

  const handleSelectCourse = useCallback((course: Course | null) => {
    if (!course) return;
    setSelectedCourse(course);
  }, []);

  type QuestionMap = Record<string, Question[]>;

  const questionsData = useMemo(() => {
    const mapModuleNamesAndQuestions = () => {
      if (!data) return undefined;

      const result: QuestionMap = {};
      const weeks = Object.keys(data);

      weeks.map((week) => {
        const entry = data[week].allQuestions;

        if (entry) {
          for (const [k, v] of Object.entries(entry)) {
            result[k] = v as unknown as Question[];
          }
        }
      });

      return result;
    };

    mapModuleNamesAndQuestions();

    return {
      handleSelectCourse,
      handleSelectModule,
      handleSelectTopic,
      questions: data,
      isLoading,
      selectedCourse,
      selectedModule,
      selectedTopic,
      modules: mapModuleNamesAndQuestions(),
    };
  }, [
    data,
    handleSelectCourse,
    handleSelectModule,
    handleSelectTopic,
    isLoading,
    selectedCourse,
    selectedModule,
    selectedTopic,
  ]);

  return questionsData;
};
