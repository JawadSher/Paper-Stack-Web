"use server";

import type { Board } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ActionResult, BoardFilters } from "@/src/types/action-types";
import { fail, ok } from "@/src/types/action-types";

export async function getBoards(
  filters: BoardFilters = {},
): Promise<ActionResult<Board[]>> {
  try {
    const boards = await prisma.board.findMany({
      where: {
        isActive: true,
        ...(filters.province && { province: filters.province }),
        ...(filters.search && {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" } },
            { shortName: { contains: filters.search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    return ok(boards);
  } catch (e) {
    return fail(`Failed to fetch boards: ${e}`);
  }
}

export async function getBoardsByProvince(): Promise<
  ActionResult<Record<string, Board[]>>
> {
  try {
    const boards = await prisma.board.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    const grouped = boards.reduce<Record<string, Board[]>>((acc, board) => {
      const key = board.province;
      acc[key] ??= [];
      acc[key].push(board);
      return acc;
    }, {});

    return ok(grouped);
  } catch (e) {
    return fail(`Failed to group boards: ${e}`);
  }
}

export async function getBoardById(
  id: string,
): Promise<ActionResult<Board | null>> {
  try {
    const board = await prisma.board.findUnique({ where: { id } });
    return ok(board);
  } catch (e) {
    return fail(`Failed to fetch board: ${e}`);
  }
}

export type PublicBoardDetail = {
  board: Pick<Board, "id" | "name" | "shortName" | "province" | "description" | "classes" | "color">;
  classSummaries: Array<{
    classLevel: number;
    subjectCount: number;
    paperCount: number;
  }>;
};

export async function getBoardDetailById(
  id: string,
): Promise<ActionResult<PublicBoardDetail | null>> {
  try {
    const board = await prisma.board.findFirst({
      where: { id, isActive: true },
      select: {
        id: true,
        name: true,
        shortName: true,
        province: true,
        description: true,
        classes: true,
        color: true,
      },
    });

    if (!board) return ok(null);

    const [subjectCounts, paperCounts] = await Promise.all([
      prisma.boardClassSubject.groupBy({
        by: ["classLevel"],
        where: {
          boardId: board.id,
          isActive: true,
          subject: { isActive: true },
        },
        _count: { _all: true },
        orderBy: { classLevel: "asc" },
      }),
      prisma.paper.groupBy({
        by: ["classLevel"],
        where: {
          boardId: board.id,
          status: "LIVE",
        },
        _count: { _all: true },
      }),
    ]);
    const paperCountByClass = new Map(
      paperCounts.map((row) => [row.classLevel, row._count._all]),
    );

    return ok({
      board,
      classSummaries: board.classes.map((classLevel) => ({
        classLevel,
        subjectCount:
          subjectCounts.find((row) => row.classLevel === classLevel)?._count
            ._all ?? 0,
        paperCount: paperCountByClass.get(classLevel) ?? 0,
      })),
    });
  } catch (e) {
    return fail(`Failed to fetch board detail: ${e}`);
  }
}
