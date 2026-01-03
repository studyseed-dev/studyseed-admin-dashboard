"use client";

import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Topic } from "@/enums/topics.enum";
import QuestionManager from "./QuestionManager";

// TODO: create api route in folder. Fetch from mongo
export default function ManageQuestions() {
  return (
    <>
      <NativeSelect>
        <NativeSelectOption value={Topic.LITERACY}>GES</NativeSelectOption>
        <NativeSelectOption value={Topic.NUMERACY}>GLP/L1&2</NativeSelectOption>
      </NativeSelect>

      <QuestionManager />
    </>
  );
}
