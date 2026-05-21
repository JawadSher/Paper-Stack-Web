"use server";

import type { Paper, PaperStatus, Prisma, Session } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type {
  ActionResult,
  AdminPaperFilters,
  PaginatedResponse,
  PaperWithRelations,
} from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";
import {
  deletePaper as deleteStoragePaper,
  getPaperStoragePath,
  uploadPaper,
} from "@/lib/storage";
import { actionError, requireAdmin, writeAudit } from "./_helpers";

const paperInclude = {
  board: {
    select: {
      id: true,
      name: true,
      shortName: true,
      province: true,
      color: true,
    },
  },
  subject: {
    select: {
      id: true,
      name: true,
      icon: true,
    },
  },
} satisfies Prisma.PaperInclude;

function buildAdminPaperWhere(
  filters: AdminPaperFilters = {},
): Prisma.PaperWhereInput {
  return {
    ...(filters.boardId && { boardId: filters.boardId }),
    ...(filters.subjectId && { subjectId: filters.subjectId }),
    ...(filters.classLevel && { classLevel: filters.classLevel }),
    ...(filters.year && { year: filters.year }),
    ...(filters.session && { session: filters.session }),
    ...(filters.status && { status: filters.status }),
  };
}

export async function getAdminPapers(
  filters: AdminPaperFilters = {},
): Promise<ActionResult<PaginatedResponse<PaperWithRelations>>> {
  try {
    await requireAdmin();
    const {
      page = 1,
      pageSize = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;
    const where = buildAdminPaperWhere(filters);

    const [data, total] = await Promise.all([
      prisma.paper.findMany({
        where,
        include: paperInclude,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.paper.count({ where }),
    ]);

    return ok({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function createPaper(input: {
  boardId: string;
  subjectId: string;
  classLevel: number;
  year: number;
  session: Session;
  title: string;
  status?: PaperStatus;
}): Promise<ActionResult<Paper>> {
  try {
    const adminUserId = await requireAdmin();
    const paper = await prisma.paper.create({
      data: {
        ...input,
        status: input.status ?? "DRAFT",
      },
    });

    await writeAudit({
      adminUserId,
      action: "create",
      entityType: "paper",
      entityId: paper.id,
      newValue: paper,
    });
    revalidatePath("/(admin)/papers");
    revalidatePath("/browse");

    return ok(paper);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function uploadPaperFile(
  paperId: string,
  formData: FormData,
): Promise<ActionResult<{ pdfUrl: string }>> {
  try {
    const adminUserId = await requireAdmin();
    const file = formData.get("file") as File | null;
    if (!file || file.type !== "application/pdf") {
      return fail("Invalid file - PDF required");
    }
    if (file.size > 52428800) {
      return fail("File too large - maximum 50MB");
    }

    const paper = await prisma.paper.findUnique({
      where: { id: paperId },
      include: { board: true, subject: true },
    });
    if (!paper) return fail("Paper not found");

    const storagePath = getPaperStoragePath({
      province: paper.board.province,
      boardShortName: paper.board.shortName,
      classLevel: paper.classLevel,
      subjectName: paper.subject.name,
      year: paper.year,
      session: paper.session,
    });

    const pdfUrl = await uploadPaper(file, storagePath);
    const updated = await prisma.paper.update({
      where: { id: paperId },
      data: {
        storagePath,
        pdfUrl,
        fileSizeBytes: BigInt(file.size),
        status: "LIVE",
        publishedAt: new Date(),
      },
    });

    await writeAudit({
      adminUserId,
      action: "update",
      entityType: "paper",
      entityId: paperId,
      oldValue: paper,
      newValue: updated,
    });
    revalidatePath("/(admin)/papers");
    revalidatePath("/browse");

    return ok({ pdfUrl });
  } catch (e) {
    return fail(`Upload failed: ${await actionError(e)}`);
  }
}

export async function updatePaper(
  id: string,
  input: Partial<{
    boardId: string;
    subjectId: string;
    classLevel: number;
    year: number;
    session: Session;
    title: string;
    status: PaperStatus;
    storagePath: string | null;
    pdfUrl: string | null;
  }>,
): Promise<ActionResult<Paper>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.paper.findUnique({ where: { id } });
    if (!existing) return fail("Paper not found");

    const updated = await prisma.paper.update({
      where: { id },
      data: {
        ...input,
        ...(input.status === "LIVE" && !existing.publishedAt
          ? { publishedAt: new Date() }
          : {}),
      },
    });

    await writeAudit({
      adminUserId,
      action: "update",
      entityType: "paper",
      entityId: id,
      oldValue: existing,
      newValue: updated,
    });
    revalidatePath("/(admin)/papers");
    revalidatePath("/browse");

    return ok(updated);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function updatePaperStatus(
  id: string,
  status: PaperStatus,
): Promise<ActionResult<Paper>> {
  return updatePaper(id, { status });
}

export async function deletePaper(id: string): Promise<ActionResult<void>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.paper.findUnique({ where: { id } });
    if (!existing) return fail("Paper not found");

    if (existing.storagePath) {
      await deleteStoragePaper(existing.storagePath);
    }

    await prisma.paper.delete({ where: { id } });
    await writeAudit({
      adminUserId,
      action: "delete",
      entityType: "paper",
      entityId: id,
      oldValue: existing,
    });
    revalidatePath("/(admin)/papers");
    revalidatePath("/browse");

    return ok(undefined);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function bulkDeletePapers(
  ids: string[],
): Promise<ActionResult<void>> {
  try {
    const adminUserId = await requireAdmin();
    const papers = await prisma.paper.findMany({
      where: { id: { in: ids } },
    });

    await Promise.all(
      papers
        .filter((paper) => paper.storagePath)
        .map((paper) => deleteStoragePaper(paper.storagePath!)),
    );
    await prisma.paper.deleteMany({ where: { id: { in: ids } } });
    await writeAudit({
      adminUserId,
      action: "delete",
      entityType: "paper",
      newValue: { ids },
      oldValue: { papers },
    });
    revalidatePath("/(admin)/papers");
    revalidatePath("/browse");

    return ok(undefined);
  } catch (e) {
    return fail(await actionError(e));
  }
}
