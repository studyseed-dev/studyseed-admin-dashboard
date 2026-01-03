import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, ChevronRight } from "lucide-react";

import { Topic } from "@/enums/topics.enum";

import { useQuestions } from "@/hooks/useQuestions";

type QuestionType =
  | "multiple-choice"
  | "drag-and-drop"
  | "matching"
  | "fill-in-the-blank"
  | "true-false";

interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: string;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: string[];
  correctAnswer: number;
}

interface DragAndDropQuestion extends BaseQuestion {
  type: "drag-and-drop";
  items: string[];
  correctOrder: number[];
}

interface MatchingQuestion extends BaseQuestion {
  type: "matching";
  leftItems: string[];
  rightItems: string[];
  correctMatches: { [key: number]: number };
}

interface FillInTheBlankQuestion extends BaseQuestion {
  type: "fill-in-the-blank";
  answer: string;
}

interface TrueFalseQuestion extends BaseQuestion {
  type: "true-false";
  correctAnswer: boolean;
}

type Question =
  | MultipleChoiceQuestion
  | DragAndDropQuestion
  | MatchingQuestion
  | FillInTheBlankQuestion
  | TrueFalseQuestion;

export default function QuestionManager() {
  const {
    selectedModule,
    selectedTopic,
    handleSelectTopic,

    handleSelectModule,
    isLoading,
    modules,
    questions,
  } = useQuestions();
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Question Manager</h1>
        <p className="text-sm text-gray-600 mt-1">Create and manage questions for your courses</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Topics & Modules */}
        <div className="w-2/5 bg-white border-r overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Topics & Modules</h2>

            <div className="space-y-4">
              {modules &&
                [Topic.LITERACY, Topic.NUMERACY].map((topic) => (
                  <div key={topic} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => {
                        if (selectedTopic === topic) {
                          handleSelectTopic(null);
                          handleSelectModule(null);
                        } else {
                          handleSelectTopic(topic);
                          handleSelectModule(null);
                        }
                      }}
                      className={`w-full text-left px-4 py-3 font-semibold transition flex items-center justify-between ${
                        selectedTopic === topic
                          ? "bg-blue-600 text-white"
                          : "bg-gray-50 text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      <span>{topic}</span>
                      <ChevronRight
                        size={20}
                        className={`transition-transform ${
                          selectedTopic === topic ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {!isLoading && selectedTopic === topic && (
                      <div className="bg-gray-50 p-2">
                        {Object.entries(modules).map(([moduleName, questions]) => (
                          <button
                            key={moduleName}
                            onClick={() => handleSelectModule(moduleName)}
                            className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition flex items-center justify-between ${
                              selectedModule === moduleName
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <span>{moduleName}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                selectedModule === moduleName
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {questions.length}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Content Area - Questions */}
        {selectedModule && modules && (
          <div className="space-y-4 overflow-auto">
            {modules[selectedModule].map((question) => (
              <div
                key={question.question_number}
                className="bg-white rounded-lg p-5 shadow-sm border-2 border-transparent hover:border-blue-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 justify-between">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-gray-500 ">
                          {question.question_number}
                        </p>
                        <span className="px-3 py-1 text-xs font-medium bg-[#3380fc] text-white rounded-full">
                          {question.question_style}
                        </span>
                      </div>
                      <button
                        // onClick={() => {
                        //   setEditingQuestion(question);
                        //   setIsCreating(false);
                        // }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 size={20} />
                      </button>
                    </div>

                    {question.question_style === "multiple_choice_question" && (
                      <div className="mt-3 space-y-2">
                        <span className="mb-3">{question.question_text}</span>

                        {question.possible_answers.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2 mt-2">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                question.correct_answer === opt
                                  ? "border-green-500 bg-green-50"
                                  : "border-gray-300"
                              }`}
                            >
                              {question.correct_answer === opt && (
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                              )}
                            </div>
                            <span className="text-sm text-gray-700">{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.question_style === "matching" && (
                      <>
                        <span>{question.question_text}</span>

                        <ol className="mt-2 text-sm font-medium">
                          {Object.entries(question.correct_answer).map(([k, v], index) => (
                            <li className="flex space-x-2" key={k}>
                              <p>
                                {index + 1}. {k} →
                              </p>
                              <p className="text-green-600">{v}</p>
                            </li>
                          ))}
                        </ol>
                      </>
                    )}

                    {question.question_style === "fill_in_the_blank" && (
                      <>
                        <span>{question.question_text}</span>
                        <p className="mt-2 text-sm  font-medium">{question.display_info}</p>
                        <p className="mt-2 text-sm text-green-600 font-medium">
                          Correct answer: {question.correct_answer}
                        </p>
                      </>
                    )}

                    {question.question_style === "drag_and_drop" && (
                      <>
                        <span>{question.question_text}</span>

                        <p className="mt-2 text-sm text-green-600 font-medium">
                          Correct answer: {question.correct_answer.join(" ")}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

//    <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
//           {currentModule ? (
//             <>
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     {/* {currentTopic?.name} - {currentModule.name} */}
//                   </h2>
//                   <p className="text-sm text-gray-600 mt-1">
//                     {currentModule.questions.length} question
//                     {currentModule.questions.length !== 1 ? "s" : ""}
//                   </p>
//                 </div>
//                 <div className="relative">
//                   <select
//                     onChange={(e) => {
//                       if (e.target.value) {
//                         handleCreateQuestion(e.target.value as QuestionType);
//                         e.target.value = "";
//                       }
//                     }}
//                     className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer appearance-none pr-10 font-medium transition"
//                     defaultValue=""
//                   >
//                     <option value="" disabled>
//                       + Add Question
//                     </option>
//                     <option value="multiple-choice">Multiple Choice</option>
//                     <option value="drag-and-drop">Drag and Drop</option>
//                     <option value="matching">Matching</option>
//                     <option value="fill-in-the-blank">Fill in the Blank</option>
//                     <option value="true-false">True/False</option>
//                   </select>
//                 </div>
//               </div>

//               {editingQuestion && renderQuestionEditor()}

//               {currentModule.questions.length > 0 ? (
//                 <div className="space-y-4">
//                   {currentModule.questions.map((question, index) => (
//                     <div
//                       key={question.id}
//                       className="bg-white rounded-lg p-5 shadow-sm border-2 border-transparent hover:border-blue-300 transition"
//                     >
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3 mb-3">
//                             <span className="text-sm font-semibold text-gray-500">
//                               Q{index + 1}
//                             </span>
//                             <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
//                               {question.type
//                                 .split("-")
//                                 .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//                                 .join(" ")}
//                             </span>
//                           </div>
//                           <p className="text-lg text-gray-800 font-medium">{question.question}</p>

//                           {question.type === "multiple-choice" && (
//                             <div className="mt-3 space-y-2">
//                               {question.options.map((opt, idx) => (
//                                 <div key={idx} className="flex items-center gap-2">
//                                   <div
//                                     className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                                       question.correctAnswer === idx
//                                         ? "border-green-500 bg-green-50"
//                                         : "border-gray-300"
//                                     }`}
//                                   >
//                                     {question.correctAnswer === idx && (
//                                       <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
//                                     )}
//                                   </div>
//                                   <span className="text-sm text-gray-700">{opt}</span>
//                                 </div>
//                               ))}
//                             </div>
//                           )}

//                           {question.type === "true-false" && (
//                             <p className="mt-2 text-sm text-green-600 font-medium">
//                               Correct answer: {question.correctAnswer ? "True" : "False"}
//                             </p>
//                           )}
//                         </div>
//                         <div className="flex gap-2 ml-4">
//                           <button
//                             onClick={() => {
//                               setEditingQuestion(question);
//                               setIsCreating(false);
//                             }}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                           >
//                             <Edit2 size={20} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteQuestion(question.id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
//                           >
//                             <Trash2 size={20} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 !editingQuestion && (
//                   <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
//                     <div className="text-gray-400 mb-4">
//                       <Plus size={48} className="mx-auto" />
//                     </div>
//                     <p className="text-gray-600 text-lg font-medium mb-2">No questions yet</p>
//                     <p className="text-gray-500 text-sm">
//                       Click Add Question to create your first question
//                     </p>
//                   </div>
//                 )
//               )}
//             </>
//           ) : (
//             <div className="h-full flex items-center justify-center">
//               <div className="text-center text-gray-400">
//                 <ChevronRight size={64} className="mx-auto mb-4 opacity-30" />
//                 <p className="text-xl font-medium mb-2">Select a module to begin</p>
//                 <p className="text-sm">Choose a topic and module from the left sidebar</p>
//               </div>
//             </div>
//           )}
//         </div>
