"use server";

import type { CommonQuestion, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ActionResult, QuestionFilters } from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";

type ChapterQuestions = {
  chapterId: string;
  chapterName: string;
  questions: CommonQuestion[];
};

function buildQuestionWhere(
  filters: QuestionFilters = {},
): Prisma.CommonQuestionWhereInput {
  return {
    ...(filters.subjectId && { subjectId: filters.subjectId }),
    ...(filters.boardId && { boardId: filters.boardId }),
    ...(filters.classLevel && { classLevel: filters.classLevel }),
    ...(filters.chapterId && { chapterId: filters.chapterId }),
    ...(filters.minFrequency && { frequency: { gte: filters.minFrequency } }),
  };
}

export async function getCommonQuestions(
  filters: QuestionFilters = {},
): Promise<ActionResult<CommonQuestion[]>> {
  try {
    const questions = await prisma.commonQuestion.findMany({
      where: buildQuestionWhere(filters),
      include: {
        questionPaperLinks: {
          include: {
            paper: {
              select: {
                id: true,
                year: true,
                session: true,
              },
            },
          },
        },
      },
      orderBy: { frequency: "desc" },
    });

    return ok(questions);
  } catch (e) {
    return fail(`Failed to fetch common questions: ${e}`);
  }
}

export async function getQuestionsByChapter(
  subjectId: string,
  boardId: string,
  classLevel: number,
  minFrequency?: QuestionFilters["minFrequency"],
): Promise<ActionResult<ChapterQuestions[]>> {
  try {
    const questions = await prisma.commonQuestion.findMany({
      where: buildQuestionWhere({
        subjectId,
        boardId,
        classLevel,
        minFrequency,
      }),
      include: {
        questionPaperLinks: {
          include: {
            paper: {
              select: {
                id: true,
                year: true,
                session: true,
              },
            },
          },
        },
      },
      orderBy: { frequency: "desc" },
    });

    const grouped = questions.reduce<Record<string, ChapterQuestions>>(
      (acc, question) => {
        acc[question.chapterId] ??= {
          chapterId: question.chapterId,
          chapterName: question.chapterName,
          questions: [],
        };
        acc[question.chapterId].questions.push(question);
        return acc;
      },
      {},
    );

    const chapters = Object.values(grouped).sort((a, b) => {
      const aFrequency = Math.max(
        ...a.questions.map((question) => question.frequency),
      );
      const bFrequency = Math.max(
        ...b.questions.map((question) => question.frequency),
      );
      return bFrequency - aFrequency;
    });

    return ok(chapters);
  } catch (e) {
    return fail(`Failed to fetch questions by chapter: ${e}`);
  }
}

export async function getQuestionById(
  id: string,
): Promise<ActionResult<CommonQuestion | null>> {
  try {
    const question = await prisma.commonQuestion.findUnique({
      where: { id },
      include: {
        questionPaperLinks: {
          include: {
            paper: {
              include: {
                board: true,
                subject: true,
              },
            },
          },
        },
      },
    });

    return ok(question);
  } catch (e) {
    return fail(`Failed to fetch question: ${e}`);
  }
}
