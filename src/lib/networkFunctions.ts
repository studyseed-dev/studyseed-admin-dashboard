import { DashboardAPIPath } from "@/enums/apiPaths.enum";
import { UpdateQuestionPayload } from "./types";

export const updateQuestionFn = async (body: UpdateQuestionPayload) => {
  const res = await fetch(DashboardAPIPath.UPDATE_QUESTION, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data?.message || "Error updating question user") as Error & {
      status?: number;
    };
    err.status = res.status;
    throw err;
  }
  return data;
};
