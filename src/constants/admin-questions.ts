import { mockQuestions, type CommonQuestion } from "@/constants/questions";
import { boards } from "@/constants/boards";

export type AdminQuestion = CommonQuestion & {
  boardIds: string[];
  sectionType: "short" | "long" | "mcq" | "practical";
  chapterId: string;
};

export const adminQuestions: AdminQuestion[] = mockQuestions.map((question, index) => ({
  ...question,
  boardIds: boards.slice(index, index + 4).map((board) => board.id),
  sectionType: index % 4 === 0 ? "long" : index % 3 === 0 ? "mcq" : "short",
  chapterId: question.chapter.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
}));
