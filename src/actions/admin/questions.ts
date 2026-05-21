"use server";

import type { CommonQuestion, Prisma, QuestionSection } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";
import { actionError, requireAdmin, writeAudit } from "./_helpers";

type QuestionInput = {
  subjectId: string;
  boardId: string;
  classLevel: number;
  questionText: string;
  chapterName: string;
  chapterId: string;
  section?: QuestionSection;
  marks?: number;
  yearsAppeared: number[];
};

async function createQuestionPaperLinks(
  questionId: string,
  input: Pick<
    QuestionInput,
    "boardId" | "subjectId" | "classLevel" | "yearsAppeared"
  >,
) {
  const papers = await prisma.paper.findMany({
    where: {
      boardId: input.boardId,
      subjectId: input.subjectId,
      classLevel: input.classLevel,
      year: { in: input.yearsAppeared },
    },
    select: { id: true, year: true },
  });

  if (papers.length === 0) return;

  await prisma.questionPaperLink.createMany({
    data: papers.map((paper) => ({
      questionId,
      paperId: paper.id,
      year: paper.year,
    })),
    skipDuplicates: true,
  });
}

export async function createQuestion(
  input: QuestionInput,
): Promise<ActionResult<CommonQuestion>> {
  try {
    const adminUserId = await requireAdmin();
    const question = await prisma.commonQuestion.create({
      data: input,
    });

    await createQuestionPaperLinks(question.id, input);
    await writeAudit({
      adminUserId,
      action: "create",
      entityType: "question",
      entityId: question.id,
      newValue: question,
    });
    revalidatePath("/common-questions");
    revalidatePath("/(admin)/questions");

    return ok(question);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function updateQuestion(
  id: string,
  input: Partial<QuestionInput>,
): Promise<ActionResult<CommonQuestion>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.commonQuestion.findUnique({
      where: { id },
      include: { questionPaperLinks: true },
    });
    if (!existing) return fail("Question not found");

    const updated = await prisma.commonQuestion.update({
      where: { id },
      data: input as Prisma.CommonQuestionUpdateInput,
    });

    if (input.yearsAppeared) {
      await prisma.questionPaperLink.deleteMany({ where: { questionId: id } });
      await createQuestionPaperLinks(id, {
        boardId: input.boardId ?? existing.boardId,
        subjectId: input.subjectId ?? existing.subjectId,
        classLevel: input.classLevel ?? existing.classLevel,
        yearsAppeared: input.yearsAppeared,
      });
    }

    await writeAudit({
      adminUserId,
      action: "update",
      entityType: "question",
      entityId: id,
      oldValue: existing,
      newValue: updated,
    });
    revalidatePath("/common-questions");
    revalidatePath("/(admin)/questions");

    return ok(updated);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function deleteQuestion(id: string): Promise<ActionResult<void>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.commonQuestion.findUnique({
      where: { id },
      include: { questionPaperLinks: true },
    });
    if (!existing) return fail("Question not found");

    await prisma.commonQuestion.delete({ where: { id } });
    await writeAudit({
      adminUserId,
      action: "delete",
      entityType: "question",
      entityId: id,
      oldValue: existing,
    });
    revalidatePath("/common-questions");
    revalidatePath("/(admin)/questions");

    return ok(undefined);
  } catch (e) {
    return fail(await actionError(e));
  }
}
