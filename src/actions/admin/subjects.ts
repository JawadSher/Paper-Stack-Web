"use server";

import type { BoardClassSubject, Subject } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";
import { actionError, requireAdmin, writeAudit } from "./_helpers";

export async function createSubject(input: {
  name: string;
  icon?: string;
  displayOrder?: number;
  isCompulsory?: boolean;
  isActive?: boolean;
}): Promise<ActionResult<Subject>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.subject.findUnique({
      where: { name: input.name },
    });
    if (existing) return fail("A subject with this name already exists");

    const subject = await prisma.subject.create({ data: input });
    await writeAudit({
      adminUserId,
      action: "create",
      entityType: "subject",
      entityId: subject.id,
      newValue: subject,
    });
    revalidatePath("/browse");
    revalidatePath("/(admin)/subjects");

    return ok(subject);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function updateSubject(
  id: string,
  input: Partial<{
    name: string;
    icon: string;
    displayOrder: number;
    isCompulsory: boolean;
    isActive: boolean;
  }>,
): Promise<ActionResult<Subject>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.subject.findUnique({ where: { id } });
    if (!existing) return fail("Subject not found");

    const updated = await prisma.subject.update({
      where: { id },
      data: input,
    });
    await writeAudit({
      adminUserId,
      action: "update",
      entityType: "subject",
      entityId: id,
      oldValue: existing,
      newValue: updated,
    });
    revalidatePath("/browse");
    revalidatePath("/(admin)/subjects");

    return ok(updated);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function deleteSubject(id: string): Promise<ActionResult<void>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.subject.findUnique({
      where: { id },
      include: { _count: { select: { papers: true, commonQuestions: true } } },
    });
    if (!existing) return fail("Subject not found");
    if (existing._count.papers > 0 || existing._count.commonQuestions > 0) {
      return fail(
        "Cannot delete: subject has papers or questions. Delete them first or mark subject inactive.",
      );
    }

    await prisma.subject.delete({ where: { id } });
    await writeAudit({
      adminUserId,
      action: "delete",
      entityType: "subject",
      entityId: id,
      oldValue: existing,
    });
    revalidatePath("/browse");
    revalidatePath("/(admin)/subjects");

    return ok(undefined);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function toggleBoardClassSubject(
  boardId: string,
  subjectId: string,
  classLevel: number,
  isActive: boolean,
): Promise<ActionResult<BoardClassSubject>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.boardClassSubject.findUnique({
      where: { boardId_subjectId_classLevel: { boardId, subjectId, classLevel } },
    });

    const row = await prisma.boardClassSubject.upsert({
      where: { boardId_subjectId_classLevel: { boardId, subjectId, classLevel } },
      create: { boardId, subjectId, classLevel, isActive },
      update: { isActive },
    });

    await writeAudit({
      adminUserId,
      action: existing ? "update" : "create",
      entityType: "board_class_subject",
      entityId: row.id,
      oldValue: existing ?? undefined,
      newValue: row,
    });
    revalidatePath("/browse");
    revalidatePath("/(admin)/classes");
    revalidatePath("/(admin)/subjects");

    return ok(row);
  } catch (e) {
    return fail(await actionError(e));
  }
}
