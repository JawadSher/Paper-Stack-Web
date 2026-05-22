"use server";

import type { Board, Prisma, Province } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type {
  ActionResult,
  AdminBoardFilters,
  PaginatedResponse,
} from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";
import { actionError, requireAdmin, writeAudit } from "./_helpers";

type BoardWithPaperCount = Board & { _count: { papers: number } };

export async function getAdminBoards(
  filters: AdminBoardFilters = {},
): Promise<ActionResult<PaginatedResponse<BoardWithPaperCount>>> {
  try {
    await requireAdmin();
    const { page = 1, pageSize = 20, province, search } = filters;
    const where: Prisma.BoardWhereInput = {
      ...(province && { province }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { shortName: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.board.findMany({
        where,
        include: { _count: { select: { papers: true } } },
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.board.count({ where }),
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

export async function getAdminBoardById(
  id: string,
): Promise<ActionResult<BoardWithPaperCount | null>> {
  try {
    await requireAdmin();
    const board = await prisma.board.findUnique({
      where: { id },
      include: { _count: { select: { papers: true } } },
    });

    return ok(board);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function createBoard(input: {
  name: string;
  shortName: string;
  province: string;
  description?: string;
  websiteUrl?: string;
  classes: number[];
  color: string;
  displayOrder?: number;
}): Promise<ActionResult<Board>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.board.findUnique({
      where: { shortName: input.shortName },
    });
    if (existing) return fail("A board with this short name already exists");

    const board = await prisma.board.create({
      data: { ...input, province: input.province as Province },
    });

    await writeAudit({
      adminUserId,
      action: "create",
      entityType: "board",
      entityId: board.id,
      newValue: board,
    });
    revalidatePath("/");
    revalidatePath("/boards");
    revalidatePath("/(admin)/boards");

    return ok(board);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function updateBoard(
  id: string,
  input: Partial<{
    name: string;
    shortName: string;
    province: string;
    description: string;
    websiteUrl: string;
    classes: number[];
    color: string;
    displayOrder: number;
    isActive: boolean;
  }>,
): Promise<ActionResult<Board>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.board.findUnique({ where: { id } });
    if (!existing) return fail("Board not found");
    const { province, ...rest } = input;

    const updated = await prisma.board.update({
      where: { id },
      data: {
        ...rest,
        ...(province && { province: province as Province }),
      },
    });

    await writeAudit({
      adminUserId,
      action: "update",
      entityType: "board",
      entityId: id,
      oldValue: existing,
      newValue: updated,
    });
    revalidatePath("/boards");
    revalidatePath("/(admin)/boards");

    return ok(updated);
  } catch (e) {
    return fail(await actionError(e));
  }
}

export async function deleteBoard(id: string): Promise<ActionResult<void>> {
  try {
    const adminUserId = await requireAdmin();
    const existing = await prisma.board.findUnique({
      where: { id },
      include: { _count: { select: { papers: true } } },
    });
    if (!existing) return fail("Board not found");
    if (existing._count.papers > 0) {
      return fail(
        `Cannot delete: board has ${existing._count.papers} papers. Delete them first or mark board inactive.`,
      );
    }

    await prisma.board.delete({ where: { id } });
    await writeAudit({
      adminUserId,
      action: "delete",
      entityType: "board",
      entityId: id,
      oldValue: existing,
    });
    revalidatePath("/boards");
    revalidatePath("/(admin)/boards");

    return ok(undefined);
  } catch (e) {
    return fail(await actionError(e));
  }
}
