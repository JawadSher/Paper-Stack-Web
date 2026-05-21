"use server";

import type { Subject } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";

export async function getAllSubjects(): Promise<ActionResult<Subject[]>> {
  try {
    const subjects = await prisma.subject.findMany({
      where: { isActive: true },
      orderBy: [{ isCompulsory: "desc" }, { displayOrder: "asc" }],
    });

    return ok(subjects);
  } catch (e) {
    return fail(`Failed to fetch subjects: ${e}`);
  }
}

export async function getSubjectsByBoardClass(
  boardId: string,
  classLevel: number,
): Promise<ActionResult<Subject[]>> {
  try {
    const rows = await prisma.boardClassSubject.findMany({
      where: {
        boardId,
        classLevel,
        isActive: true,
        subject: { isActive: true },
      },
      include: { subject: true },
      orderBy: [
        { subject: { isCompulsory: "desc" } },
        { subject: { displayOrder: "asc" } },
      ],
    });

    return ok(rows.map((row) => row.subject));
  } catch (e) {
    return fail(`Failed to fetch subjects for board/class: ${e}`);
  }
}

export async function getSubjectById(
  id: string,
): Promise<ActionResult<Subject | null>> {
  try {
    const subject = await prisma.subject.findUnique({ where: { id } });
    return ok(subject);
  } catch (e) {
    return fail(`Failed to fetch subject: ${e}`);
  }
}
