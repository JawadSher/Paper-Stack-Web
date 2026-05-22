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
  board: Pick<Board, "id" | "name" | "shortName" | "province" | "description" | "color">;
  previewSubjects: Array<{
    id: string;
    name: string;
    classLevel: number;
    paperCount: number;
  }>;
};

export async function getBoardDetailById(
  id: string,
  previewClassLevel = 10,
  previewLimit = 6,
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
        color: true,
        boardClassSubjects: {
          where: {
            classLevel: previewClassLevel,
            isActive: true,
            subject: { isActive: true },
          },
          select: {
            classLevel: true,
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: [
            { subject: { isCompulsory: "desc" } },
            { subject: { displayOrder: "asc" } },
          ],
          take: previewLimit,
        },
      },
    });

    if (!board) return ok(null);

    const subjectIds = board.boardClassSubjects.map((row) => row.subject.id);
    const paperCounts = subjectIds.length
      ? await prisma.paper.groupBy({
          by: ["subjectId"],
          where: {
            boardId: board.id,
            classLevel: previewClassLevel,
            subjectId: { in: subjectIds },
            status: "LIVE",
          },
          _count: { _all: true },
        })
      : [];
    const countBySubjectId = new Map(
      paperCounts.map((row) => [row.subjectId, row._count._all]),
    );

    const { boardClassSubjects, ...boardFields } = board;

    return ok({
      board: boardFields,
      previewSubjects: boardClassSubjects.map((row) => ({
        id: row.subject.id,
        name: row.subject.name,
        classLevel: row.classLevel,
        paperCount: countBySubjectId.get(row.subject.id) ?? 0,
      })),
    });
  } catch (e) {
    return fail(`Failed to fetch board detail: ${e}`);
  }
}
